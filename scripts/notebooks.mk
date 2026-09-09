# Invoke from build/: make -f ../scripts/notebooks.mk -j6 testNotebooks.run
CONDA_ENV ?= gtbook-colab
GTBOOK_ROOT ?=

.PHONY: testNotebooks.run
testNotebooks.run:
	cd .. && conda run --no-capture-output -n $(CONDA_ENV) python scripts/run_notebooks.py $(if $(GTBOOK_ROOT),--gtbook-root "$(GTBOOK_ROOT)") $(NOTEBOOK_ARGS)

.PHONY: testBook.run
testBook.run:
	cd .. && MPLBACKEND=module://matplotlib_inline.backend_inline OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 conda run --no-capture-output -n $(CONDA_ENV) jupyter-book build . --all

.PHONY: testS76CI.run
testS76CI.run:
	cd .. && conda run --no-capture-output -n $(CONDA_ENV) python -m unittest discover -s tests -p 'test_s76_ci.py' -v
	cd .. && node --test tests/test_report_s76.cjs
