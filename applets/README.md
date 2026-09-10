# The Robotics Laboratory

An independent companion to *Robotics & Perception*. Open [the index](index.html) to explore 33 standalone section laboratories with 74 tabbed demonstrations, including the original S24 sensor-fusion applet. Each page can be copied or downloaded and used offline.

## Section coverage

| Section | Laboratory | Experiments |
| --- | --- | --- |
| 2.1 | [Modeling the World State](S21_sorter_state.html) | PMF → CDF → samples; Normalize a specification |
| 2.2 | [Actions for Sorting Trash](S22_sorter_actions.html) | The cost of an action |
| 2.3 | [Sensors for Sorting Trash](S23_sorter_sensing.html) | Conditional weight density; Shape a Gaussian; Simulate all three sensors |
| 2.4 | [The Perception Engine](S24_perception.html) | Weight likelihood; detector likelihood; adjustable-prior MAP sensor fusion; posterior curves |
| 2.5 | [Decision Theory](S25_sorter_decision_theory.html) | Which bin should we choose? |
| 2.6 | [Learning from Data](S26_sorter_learning.html) | Learn a categorical distribution; Learn sensor conditionals; Fit a Gaussian from samples |
| 3.1 | [The Vacuum’s State](S31_vacuum_state.html) | A belief over rooms |
| 3.2 | [Actions over Time](S32_vacuum_actions.html) | Propagate a belief; Factor location and battery |
| 3.3 | [Dynamic Bayesian Networks](S33_vacuum_sensing.html) | A light sensor model; Sample a dynamic Bayes net |
| 3.4 | [Perception with Graphical Models](S34_vacuum_perception.html) | Infer the hidden trajectory |
| 3.5 | [Markov Decision Processes](S35_vacuum_decision.html) | Immediate reward; Evaluate a policy; Control-tape rollouts |
| 3.6 | [Learning to Act Optimally](S36_vacuum_RL.html) | Value iteration; Policy iteration; Learn from experience |
| 4.1 | [Continuous State](S41_logistics_state.html) | Three Gaussian components; Shape a covariance |
| 4.2 | [Moving in 2D](S42_logistics_actions.html) | Omni-wheel kinematics; Gaussian motion model |
| 4.3 | [Continuous Sensor Models](S43_logistics_sensing.html) | RFID range likelihood; Proximity sensor; GPS-like likelihood |
| 4.4 | [Localization](S44_logistics_perception.html) | Markov localization; Monte Carlo localization; Three constraints, two unknowns; Kalman smoothing |
| 4.5 | [Planning for Logistics](S45_logistics_planning.html) | Warehouse value iteration |
| 4.6 | [System Identification](S46_logistics_learning.html) | Identify a scalar sensor; Identify a multivariate model |
| 5.1 | [Differential-drive State](S51_diffdrive_state.html) | Position and heading |
| 5.2 | [Differential-drive Motion](S52_diffdrive_actions.html) | Wheel speeds and body motion |
| 5.3 | [Cameras for Robot Vision](S53_diffdrive_sensing.html) | A person through a pinhole; Pixel rays and field of view |
| 5.4 | [Computer Vision 101](S54_diffdrive_perception.html) | A derivative you can inspect; Find edges in the robot image; Pretrained vision results |
| 5.5 | [Path Planning](S55_diffdrive_planning.html) | Grow a rapidly exploring tree |
| 5.6 | [Deep Learning](S56_diffdrive_learning.html) | Between grid vertices; Learn sine and cosine |
| 6.1 | [Planar Geometry](S61_driving_state.html) | Rotate and translate a point; Order matters |
| 6.3 | [Sensing for Autonomous Vehicles](S63_driving_sensing.html) | Lidar in a three-wall corridor; Inspect the real lidar scans |
| 6.4 | [SLAM](S64_driving_perception.html) | Close the loop; Bearing–range SLAM; Larger graph and uncertainty |
| 7.1 | [Moving in Three Dimensions](S71_drone_state.html) | A point in a 3D frame; Roll, pitch, and yaw |
| 7.2 | [Multi-rotor Aircraft](S72_drone_actions.html) | Pitch and steady speed; Integrate body motion; Forces, drag, and turning |
| 7.3 | [Sensing for Drones](S73_drone_sensing.html) | Three cameras on a drone |
| 7.4 | [Visual SLAM](S74_drone_perception.html) | Integrate an inertial measurement; Notebook results |
| 7.5 | [Trajectory Optimization](S75_drone_planning.html) | Probe a smooth obstacle cost; Bend a path around obstacles; Thrust, attitude, and motor forces; Notebook results |
| 7.6 | [Neural Radiance Fields](S76_drone_learning.html) | Sample camera rays; Composite color along a ray; Trilinear interpolation; Before training a radiance field; Notebook results |

The collection covers every section with substantive executable Python. Introductions, summaries, S62 (no code), S65 (comments only), and S66 (imports only) are excluded. Existing notebook widgets are included in S23 and S24.

Fixed numerical examples match the notebooks. Random experiments expose a reproducible browser seed. Five tabs present recorded notebook results alongside the live experiments: pretrained vision in S54, larger graph results in S64, IMU/SfM results in S74, advanced trajectory results in S75, and trained rendering results in S76. These tabs are labeled and do not imply live model inference or training.

See [the source and validation guide](../scripts/applets/README.md) to rebuild or extend the collection.
