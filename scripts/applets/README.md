# Building the robotics laboratories

The published pages in `applets/` are independent HTML documents with embedded JavaScript, CSS, data, and images. They require no server, Python, CDN, or network connection. The index links into this separate collection; the book does not link back to it.

## Edit and rebuild

- `sections.json`: section titles and descriptions, in book order.
- `sorter.js`, `vacuum.js`, `logistics.js`, `diffdrive.js`, `driving.js`, `drone.js`: experiment definitions grouped by robot chapter.
- `models.js`: numerical kernels; `runtime.js`: controls, accessible tabs, SVG plots, and tables; `style.css`: the shared brass-and-teal presentation.
- `data/`: exported book images, small lidar subsets, and fixed maps. These are source assets; the builder embeds the relevant data into each page.
- `build.py`: embeds the source and the referenced notebook Python cells. S24 retains its original implementation; the builder includes it in the index without overwriting it.

From the repository root:

```sh
conda run --no-capture-output -n py312 python scripts/applets/build.py
```

To refresh embedded notebook figures, camera pixels, the three lidar subsets, or map assets:

```sh
conda run --no-capture-output -n py312 python scripts/applets/export_data.py
conda run --no-capture-output -n py312 python scripts/applets/build.py
```

The asset exporter uses NumPy and Pillow. It reads existing notebook outputs and local images/PLY files, and reproduces the fixed `gtbook` map-generation algorithms. It does not download or execute pretrained models. All generated files should be reviewed and committed alongside the source changes.

## Validate

Numerical references require the `py312` environment with NumPy, GTSAM, gtbook, and Pillow. DOM validation uses Node and the development-only jsdom dependency:

```sh
npm install --prefix scripts/applets
mkdir -p build
cd build
make -j6 -f ../scripts/applets/Makefile testApplets.run
```

Run the make command with escalated permissions as required by the workspace instructions. The test target generates reference data in the build directory, then checks:

- All 33 indexed section pages, embedded assets, and notebook code references.
- Default calculations and every slider endpoint and selector option for the 70 new experiments.
- Keyboard tab navigation and reset behavior.
- 54 independent numerical cases, including complete probability tables and warehouse value maps, image edge counts, GTSAM pose-graph and landmark solutions, and drone obstacle costs.
- 198 GTSAM posterior comparisons and interactive controls for the original S24 applet.

These are numerical and DOM tests. They do not substitute for visual review in a browser, and they do not run the heavy notebook training pipelines.

## Numerical fidelity

Fixed parameters match their notebook examples. Browser random experiments use an explicit Mulberry32 seed and Box–Muller Gaussian samples; they reproduce the distributions, not an unseeded NumPy or PyTorch realization. Additional controls and simplified experiments are identified in each page.

The Markov filter uses the notebook's grid and threshold, with Gaussian convolution truncated at six standard deviations. The small SLAM graphs use damped finite-difference Gauss–Newton and are checked against GTSAM. Drone path optimization minimizes the same objective with analytic gradients and backtracking descent, so the finite-iteration path can differ from GTSAM's Levenberg–Marquardt output. Recorded figures preserve the latter for comparison.

S71 explicitly distinguishes the literal `Rot3.Yaw(math.degrees(20))` example from its comment's intended 20-degree rotation. S74's live experiment isolates IMU integration and bias correction rather than claiming to reproduce the full IMU graph optimization. DeepLab, MiDaS, the larger graph/SfM examples, Chebyshev trajectory tracking, and trained Stonehenge outputs appear as clearly labeled recorded notebook figures.

The existing GitHub Pages workflow copies the `applets` directory into the book's HTML output. Publishing this collection therefore uses the existing repository deployment; no book TOC changes are needed.
