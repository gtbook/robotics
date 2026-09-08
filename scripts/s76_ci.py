#!/usr/bin/env python
"""Execute S76 independently and prepare a book build with safe saved-output fallback."""
import argparse
import os
from pathlib import Path
import tempfile
import traceback

import nbformat
from nbclient import NotebookClient
import yaml


def atomic_notebook(nb, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode='w', dir=path.parent, suffix='.ipynb', delete=False) as f:
        temporary = Path(f.name)
        nbformat.write(nb, f)
    try:
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def execute(notebook, output_dir, timeout=300):
    """Never modify the source; checkpoint diagnostics even before a hard timeout."""
    notebook = Path(notebook).resolve()
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    nb = nbformat.read(notebook, as_version=4)
    for cell in nb.cells:
        if cell.cell_type == 'code':
            cell.outputs = []
            cell.execution_count = None
    partial = output_dir / 'attempt.ipynb'
    completed = output_dir / 'executed.ipynb'
    completed.unlink(missing_ok=True)
    (output_dir / 'error.txt').unlink(missing_ok=True)
    atomic_notebook(nb, partial)
    os.environ['MPLBACKEND'] = 'module://matplotlib_inline.backend_inline'

    def checkpoint(**kwargs):
        atomic_notebook(nb, partial)

    def progress(cell_index, **kwargs):
        print(f'Executing S76 cell {cell_index + 1}', flush=True)

    client = NotebookClient(nb, timeout=timeout, kernel_name='python3',
                            resources={'metadata': {'path': str(notebook.parent)}},
                            allow_errors=False, force_raise_errors=True,
                            on_cell_start=progress, on_cell_executed=checkpoint)
    try:
        client.execute()
    except Exception:
        atomic_notebook(nb, partial)
        (output_dir / 'error.txt').write_text(traceback.format_exc())
        raise
    atomic_notebook(nb, completed)
    print(f'S76 execution succeeded: {completed}', flush=True)


def prepare(notebook, output_dir, config, prepared_config, use_executed=False):
    """Only promote a successful execution, then exclude S76 from book execution."""
    notebook, config = Path(notebook).resolve(), Path(config).resolve()
    if use_executed:
        nb = nbformat.read(Path(output_dir) / 'executed.ipynb', as_version=4)
        for cell in nb.cells:
            if cell.cell_type == 'code' and cell.source.strip():
                if cell.execution_count is None or any(o.output_type == 'error' for o in cell.outputs):
                    raise ValueError('Cannot publish incomplete or failed S76 outputs')
        atomic_notebook(nb, notebook)
    settings = yaml.safe_load(config.read_text())
    execution = settings.setdefault('execute', {})
    exclusions = execution.setdefault('exclude_patterns', [])
    name = notebook.relative_to(config.parent).as_posix()
    if name not in exclusions:
        exclusions.append(name)
    prepared_config = Path(prepared_config)
    prepared_config.parent.mkdir(parents=True, exist_ok=True)
    prepared_config.write_text(yaml.safe_dump(settings, sort_keys=False))
    print('S76: fresh outputs' if use_executed else 'S76: saved committed outputs')


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('action', choices=['execute', 'prepare'])
    p.add_argument('--notebook', type=Path, default=Path('S76_drone_learning.ipynb'))
    p.add_argument('--output-dir', type=Path, required=True)
    p.add_argument('--timeout', type=int, default=300)
    p.add_argument('--config', type=Path, default=Path('_config.yml'))
    p.add_argument('--prepared-config', type=Path)
    p.add_argument('--use-executed', action='store_true')
    args = p.parse_args()
    if args.action == 'execute':
        execute(args.notebook, args.output_dir, args.timeout)
    else:
        if args.prepared_config is None:
            p.error('prepare requires --prepared-config')
        prepare(args.notebook, args.output_dir, args.config, args.prepared_config, args.use_executed)


if __name__ == '__main__':
    main()
