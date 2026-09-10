# Run from any build directory: make -j6 -f /path/to/scripts/applets/Makefile testApplets.run
APPLET_SOURCE := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
.PHONY: testApplets.run
testApplets.run:
	conda run --no-capture-output -n py312 python "$(APPLET_SOURCE)reference.py"
	conda run --no-capture-output -n py312 python "$(APPLET_SOURCE)reference_s24.py"
	node "$(APPLET_SOURCE)test_applets.cjs"
	node "$(APPLET_SOURCE)test_s24.cjs"
