#!/usr/bin/env python
"""Execute tracked notebooks while preserving the selected gtbook installation."""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import importlib.metadata
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import traceback

import nbformat
from nbclient import NotebookClient


INSTALL = re.compile(r"^\s*%pip\s+install\s+(?:-[\w-]+\s+)*gtbook\s*$")


def execute_one(path, root, output, gtbook_root, timeout):
    relative = path.relative_to(root)
    destination = output / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    progress = destination.with_suffix('.progress.json')
    started = time.monotonic()
    nb = nbformat.read(path, as_version=4)
    skipped = []
    original_code = sum(c.cell_type == 'code' for c in nb.cells)
    for i, cell in enumerate(nb.cells):
        if cell.cell_type != 'code':
            continue
        cell.outputs = []
        cell.execution_count = None
        lines = cell.source.splitlines()
        for j, line in enumerate(lines):
            if line.lstrip().startswith("#"):
                continue
            if INSTALL.fullmatch(line):
                skipped.append({'cell': i + 1, 'command': line})
                lines[j] = 'print("Using the selected gtbook installation; installation skipped.")'
            elif re.search(r'(?:%pip|!pip|pip\s+install).*gtbook', line):
                raise ValueError(f'Unrecognized gtbook install command: {relative}:{i + 1}: {line}')
        cell.source = '\n'.join(lines)
    guard = (
        'import pathlib, sys, gtbook\n'
        f'assert pathlib.Path(gtbook.__file__).resolve().is_relative_to(pathlib.Path({str(gtbook_root)!r}).resolve()), gtbook.__file__\n'
        f'assert pathlib.Path(sys.executable).resolve() == pathlib.Path({sys.executable!r}).resolve(), sys.executable\n'
        'print("Python:", sys.version)\n'
        'print("Selected gtbook:", gtbook.__file__)\n'
    )
    nb.cells.insert(0, nbformat.v4.new_code_cell(guard))
    nb.cells.append(nbformat.v4.new_code_cell(guard))
    last_cell = 0

    def on_cell_start(cell, cell_index, **kwargs):
        nonlocal last_cell
        # The injected first cell offsets zero-based indices to original cell numbers.
        last_cell = cell_index
        progress.write_text(json.dumps({'notebook': str(relative), 'cell': cell_index,
                                        'elapsed_seconds': round(time.monotonic() - started, 1)}))

    result = {'notebook': str(relative), 'code_cells': original_code, 'skipped_installs': skipped}
    if original_code == 0:
        result.update(status='no_code', seconds=0)
        return result
    client = NotebookClient(nb, timeout=timeout, kernel_name='python3',
                            resources={'metadata': {'path': str(path.parent)}},
                            record_timing=True, on_cell_start=on_cell_start)
    try:
        client.execute()
        result['status'] = 'passed'
    except Exception as exc:
        result.update(status='failed', cell=last_cell, error_type=type(exc).__name__, error=str(exc))
        destination.with_suffix('.error.txt').write_text(traceback.format_exc())
    finally:
        nbformat.write(nb, destination)
        result['seconds'] = round(time.monotonic() - started, 1)
        destination.with_suffix('.result.json').write_text(json.dumps(result, indent=2))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--gtbook-root', type=Path, help='Expected package root; defaults to the installed gtbook package')
    parser.add_argument('--output', type=Path, default=Path('build/notebook-results'))
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--timeout', type=int, default=300, help='Per-cell timeout in seconds')
    parser.add_argument('notebooks', nargs='*', help='Default: all tracked notebooks')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    output = (root / args.output).resolve()
    output.mkdir(parents=True, exist_ok=True)
    names = args.notebooks or subprocess.check_output(
        ['git', 'ls-files', '*.ipynb'], cwd=root, text=True).splitlines()
    import gtbook
    gtbook_root = (args.gtbook_root or Path(gtbook.__file__).parent).resolve()
    if not Path(gtbook.__file__).resolve().is_relative_to(gtbook_root):
        parser.error(f'Expected gtbook from {gtbook_root}, found {gtbook.__file__}')
    os.environ['MPLBACKEND'] = 'module://matplotlib_inline.backend_inline'
    os.environ['OMP_NUM_THREADS'] = '1'
    os.environ['OPENBLAS_NUM_THREADS'] = '1'
    os.environ['MKL_NUM_THREADS'] = '1'
    versions = {p: importlib.metadata.version(p) for p in
                ('gtbook', 'gtsam', 'numpy', 'torch', 'plotly', 'kaleido', 'nbclient')}
    report = {'started': datetime.now(timezone.utc).isoformat(), 'python': sys.version,
              'executable': sys.executable, 'gtbook_path': gtbook.__file__, 'versions': versions,
              'commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
              'timeout_per_cell': args.timeout, 'results': []}
    print(json.dumps({k: v for k, v in report.items() if k != 'results'}, indent=2), flush=True)
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        jobs = {pool.submit(execute_one, root / name, root, output, gtbook_root, args.timeout): name
                for name in names}
        for job in as_completed(jobs):
            try:
                result = job.result()
            except Exception as exc:
                result = {'notebook': jobs[job], 'status': 'runner_error', 'error': str(exc)}
            report['results'].append(result)
            report['results'].sort(key=lambda r: r['notebook'])
            (output / 'summary.json').write_text(json.dumps(report, indent=2))
            print(f"{result['status'].upper():12s} {result['notebook']} "
                  f"({result.get('seconds', 0)}s) {result.get('error', '').splitlines()[0:1]}", flush=True)
    counts = {status: sum(r['status'] == status for r in report['results'])
              for status in ('passed', 'no_code', 'failed', 'runner_error')}
    print(json.dumps(counts), flush=True)
    return int(counts['failed'] + counts['runner_error'] > 0)


if __name__ == '__main__':
    sys.exit(main())
