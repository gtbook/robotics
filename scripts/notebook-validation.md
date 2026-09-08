# Notebook validation — 2026-09-08

Branch: `codex/python313-notebook-validation`, created from the latest fetched
`origin/main`, commit `5f8bead149fb78a89aa1ec3ef8928f03260b028a`.

All 61 tracked notebooks were considered, including `old_intro/`. After the fixes
below, all 43 executable notebooks pass and 18 have no code. The passing results
combine the initial full run with targeted reruns of corrected notebooks and
the successful S76 retry after Zenodo recovered.

## Environment and execution

The existing `gtbook-colab` conda environment was used on macOS arm64, with Python
3.13.15, GTSAM 4.3a2, NumPy 2.1.3, PyTorch 2.11.0, Plotly 5.24.1, and Kaleido
0.2.1. These are observed versions, not new dependency pins. Added `nbclient`,
`ipywidgets`, `torchvision` (0.26.0, matching PyTorch), and `timm` to run the book.
`pip check` passes.

Every executable notebook runs in a fresh kernel. The runner checks that the
kernel uses the requested Python executable and imports the local editable
`../gtbook` checkout before and after execution. It replaces 41 `%pip install ...
gtbook` commands in execution copies, so they cannot replace the local package
with a published version. Source installation cells remain unchanged. No
computational cells are deliberately skipped or shortened. A cell has a
300-second timeout.

## Fixes verified by rerunning the affected notebooks

| Notebook | Failure | Change |
| --- | --- | --- |
| `S24_sorter_perception.ipynb` | Exact equality to 1.0 fails after posterior normalization. | Check normalization with an absolute tolerance of 1e-12. |
| `S54_diffdrive_perception.ipynb` | Torch Hub's torchvision v0.10.0 imports removed PyTorch ONNX internals. | Use the installed torchvision segmentation API with the corresponding pretrained DeepLabV3 weights. |
| `S72_drone_actions.ipynb` | Modern dataclasses reject an ndarray default for `gn`. | Initialize the gravity vector per instance from `self.g` in `__post_init__`. |

The runner initially rejected a commented-out installation command in
`S34_vacuum_perception.ipynb`. After correcting that check, the notebook passes
without source changes.

## S76 retry: passed

The initial S76 run stopped at cell 49 because Zenodo returned HTTP 504 while
serving the training-ray dataset. After Zenodo recovered, the unchanged notebook
passed in 38.2 seconds, including dataset loading, pretrained model loading,
and rendering the final image grid. All 25 original code cells executed, with
the gtbook installation command suppressed as described above. The notebook
uses `use_pretrained = True`; the alternative training-from-scratch branch was
not exercised. No S76 source changes were needed.

## Reproduce

With gtbook installed in the chosen environment (published or editable):

```bash
mkdir -p build
cd build
make -f ../scripts/notebooks.mk -j6 testNotebooks.run
```

Override `CONDA_ENV` as needed. Set `GTBOOK_ROOT` to require a particular editable checkout; by default the runner guards the installed package path. To rerun one notebook:

```bash
make -f ../scripts/notebooks.mk -j6 testNotebooks.run \
  NOTEBOOK_ARGS='--output build/notebook-retry S76_drone_learning.ipynb'
```

Executed copies, cell progress, errors, and machine-readable summaries are saved
under ignored `build/` directories. Initial results are in `notebook-results/`,
the vacuum-perception rerun in `notebook-retry/`, and the three source-fix reruns
in `notebook-fixes/`. The successful S76 retry is in `notebook-s76-retry/`.


## Published release and local book build

The rollout validation uses the published **gtbook 0.0.41** wheel from PyPI,
not the editable checkout. All 42 notebook `%pip` lines (including a commented
line) are unchanged relative to the branch base. The separate notebook runner
suppresses active installation commands in its execution copies; Jupyter Book
executes the original installation cells.

The shared `environment.yml` now uses Python 3.13, Jupyter Book `>=1,<2`
(the existing Sphinx configuration), current Matplotlib, torchvision, and
compatible Plotly/Kaleido bounds. It requires gtbook `>=0.0.41`. The workflow
uses this environment, drops its inactive legacy lock-file path, and builds
pull requests without deploying them. No workflow was triggered by this local
validation. Notebook errors now stop the build; the per-cell timeout is 300 seconds.

The actual local builder is Jupyter Book 1.0.4.post1. `pip check` passes.
To build locally from `build/`:

```bash
make -f ../scripts/notebooks.mk -j6 testBook.run
```

Current release-validation results and build outcome are recorded below.

### Outcome

- Fresh published-package execution: **42 passed, 18 no code, 1 failed**.
  S76 fails because Zenodo returns HTTP 504 for `training_rays-199-4.npz`,
  including on retries. This is not a GTSAM or NumPy failure.
- The full forced Jupyter Book execution reached S76 and stopped on that same
  download. An earlier Kaleido stall at S23 disappeared on the sequential retry.
- Fixed a validation-rendering issue: `Agg` omitted some Matplotlib outputs.
  The runner, local build target, and prepared CI now select the inline backend.
  A fresh rerun captured 91 PNG outputs versus 84 previously, with the same
  42 passing executable notebooks.
- A separate **local preview** successfully renders all 57 HTML pages at
  `build/local-preview/_build/html/index.html`. It combines the fresh inline
  execution outputs with **S76's existing source-notebook outputs**, since
  fresh execution is blocked. This preview does not establish a fresh S76 pass.
  Strict execution remains enabled in the actual source configuration.
- Local HTML asset/link checks found no missing file targets. The preview has
  302 Sphinx/MyST warnings and 156 unresolved fragment links; these are left
  unchanged at the user's explicit request. External URLs were not exhaustively
  checked. Automated browser inspection was blocked by its file-URL policy;
  generated figure files were inspected directly.
- No commit, push, CI run, or deployment was performed for this rollout work.

Fresh results: `build/notebook-pypi-041-inline/summary.json`.
Forced-build log: `build/book-pypi-041-retry.log`.
Preview-build log: `build/book-preview-inline.log`.
Local-link report: `build/html-link-check.json`.
