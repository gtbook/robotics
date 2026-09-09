import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest

import nbformat
import yaml

SPEC = importlib.util.spec_from_file_location('s76_ci', Path(__file__).resolve().parents[1] / 'scripts/s76_ci.py')
ci = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(ci)


class S76Tests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.source = self.root / 'S76_drone_learning.ipynb'
        self.config = self.root / '_config.yml'
        self.config.write_text('title: Test\nexecute:\n  execute_notebooks: force\n  timeout: 300\n  allow_errors: false\n  raise_on_error: true\n')
        self.prepared = self.root / 'ci-config.yml'
        self.outputs = self.root / 'diagnostics'

    def notebook(self, code):
        cell = nbformat.v4.new_code_cell(code, execution_count=7,
            outputs=[nbformat.v4.new_output('stream', name='stdout', text='SAVED OUTPUT\n')])
        nb = nbformat.v4.new_notebook(cells=[cell], metadata={
            'kernelspec': {'name': 'python3', 'display_name': 'Python 3', 'language': 'python'}})
        nbformat.write(nb, self.source)
        return self.source.read_bytes()

    def prepare(self, fresh=False):
        ci.prepare(self.source, self.outputs, self.config, self.prepared, fresh)

    def test_success_promotes_only_after_execution(self):
        original = self.notebook('print("FRESH OUTPUT")')
        ci.execute(self.source, self.outputs)
        self.assertEqual(self.source.read_bytes(), original)
        self.prepare(True)
        nb = nbformat.read(self.source, 4)
        self.assertEqual(nb.cells[0].source, 'print("FRESH OUTPUT")')
        self.assertIn('FRESH OUTPUT', nb.cells[0].outputs[0].text)

    def test_failures_preserve_saved_source(self):
        for code, timeout in [
            ('from requests import HTTPError\nraise HTTPError("504 from Zenodo")', 300),
            ('raise ValueError("unrelated notebook error")', 300),
            ('import time\ntime.sleep(5)', 1),
        ]:
            with self.subTest(code=code):
                original = self.notebook(code)
                with self.assertRaises(Exception):
                    ci.execute(self.source, self.outputs, timeout)
                self.assertEqual(self.source.read_bytes(), original)
                self.assertTrue((self.outputs / 'attempt.ipynb').exists())
                self.assertTrue((self.outputs / 'error.txt').exists())
                self.assertFalse((self.outputs / 'executed.ipynb').exists())
                self.prepare()
                self.assertEqual(self.source.read_bytes(), original)
                self.assertEqual(yaml.safe_load(self.prepared.read_text())['execute']['exclude_patterns'], [self.source.name])
                self.assertNotIn('exclude_patterns', self.config.read_text())

    def test_book_renders_saved_outputs_and_other_errors_are_fatal(self):
        self.notebook('raise RuntimeError("S76 must not execute again")')
        nb = nbformat.read(self.source, 4)
        # A small valid PNG makes image retention observable in the HTML build.
        png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='
        nb.cells[0].outputs.append(nbformat.v4.new_output('display_data', data={'image/png': png}))
        nbformat.write(nb, self.source)
        self.prepare()
        (self.root / '_toc.yml').write_text('format: jb-book\nroot: index\nchapters:\n  - file: S76_drone_learning\n')
        index = nbformat.v4.new_notebook(cells=[nbformat.v4.new_code_cell('print("OTHER NOTEBOOK EXECUTED")')], metadata=nb.metadata)
        nbformat.write(index, self.root / 'index.ipynb')
        command = ['jupyter-book', 'build', str(self.root), '--config', str(self.prepared), '--all']
        result = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        html = (self.root / '_build/html/S76_drone_learning.html').read_text()
        self.assertIn('SAVED OUTPUT', html)
        self.assertTrue(list((self.root / '_build/html/_images').glob('*.png')))
        self.assertIn('OTHER NOTEBOOK EXECUTED', (self.root / '_build/html/index.html').read_text())
        index.cells[0].source = 'raise RuntimeError("Other notebook failure must remain fatal")'
        nbformat.write(index, self.root / 'index.ipynb')
        failed = subprocess.run(command, capture_output=True, text=True)
        self.assertNotEqual(failed.returncode, 0)
        self.assertIn('Other notebook failure must remain fatal', failed.stdout + failed.stderr)


if __name__ == '__main__':
    unittest.main()
