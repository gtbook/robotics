# Introduction to Robotics and Perception *Draft*

> Copyright (c) Frank Dellaert and Seth Hutchinson, All rights Reserved

> The code in the notebooks and python .py files is covered by the BSD license, like GTSAM; see the LICENSE file for details.

> The remainder (including all markdown cells in the notebooks and other prose) is not licensed for any redistribution or change of format or medium, other than making copies of the notebooks or forking this repo for your own private use. No commercial or broadcast use is allowed. We are making these materials freely available to help you learn robotics, so please respect our copyright and these restrictions.


This repository contains one python notebook per section.

[![deploy-book](https://github.com/gtbook/robotics/actions/workflows/book.yml/badge.svg)](https://github.com/gtbook/robotics/actions/workflows/book.yml)

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/gtbook/robotics/HEAD)

Current Draft TOC (chapters will be viewable as we finish drafts):

## Chapter 0: General Introduction

## Chapter 1: Discrete: Trash Sorter
- 1.1 State:	    plastic|paper|cardboard|metal|glass|unknown
- 1.2 Actuators: 	gripper (4 actions or no-op)
- 1.3 Sensors: 	    Attributes -> colors (5), size (SML), weights (LH)
- 1.4 Perception: 	Estimation probabilities of plastic|paper|cardboard|metal|unknown
- 1.5 Planning:     Decision Theory -> sort into three bins (plastics|mixed paper|metals|glass) or do nothing
- 1.6 Learning:     Learning sensor models (discrete)

## Chapter 2: Discrete: Vacuum Cleaner
- 2.1 State:		house
- 2.2 Actuators: 	noisy graph
- 2.3 Sensors: 	    noisy light
- 2.4 Perception: 	HMM
- 2.5 Planning: 	MDP
- 2.6 Learning:     Model-based RL and Policy Iteration

## Chapter 3: 2D: Logistics Platform
- 3.1 State:		x,y
- 3.2 Actuators: 	Swedish wheels, round robot
- 3.3 Sensors: 	    2D LIDAR
- 3.4 Perception: 	Localization
- 3.5 Planning: 	Graph-based stuff, config space
- 3.6 Learning:     Learning motion models (continuous)

## Chapter 4: x,y,theta: Duckiebot
- 4.1 State:		x, y, theta (not fully SE(2) and 3x3 matrices yet)
- 4.2 Actuators: 	differential drive
- 4.3 Sensors: 	    Camera, image formation
- 4.4 Perception: 	CNN Place Recognition
- 4.5 Planning: 	Dubbins etc, Sampling-based planning
- 4.6 Deep Learning:Stochastic Gradient descent for CNN

## Chapter 5: SE(2): Autonomous Vehicle
- 5.1 State:		SE(2): SO(2) and 3x3 homogeneous
- 5.2 Actuators: 	Ackerman steering
- 5.3 Sensors: 	    3D LIDAR
- 5.4 Perception: 	ICP, Pose-SLAM
- 5.5 Planning: 	Motion Primitives
- 5.6 Learning: 	Deep Reinforcement Learning (Policy Gradient)

## Chapter 6: SE(3): Drone
- 6.1 State:		SE(3): SO(3) and 4x4 homogeneous
- 6.2 Actuators: 	Quad-rotor
- 6.3 Sensors: 	    Camera in 3D, geometry, stereo
- 6.4 Perception: 	Visual SLAM
- 6.5 Planning: 	Trajectory Optimization
- 6.6 Learning:     Tentative: Safe Flying
