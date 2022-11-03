# Elena App

## Overview

The Elevation-Based Navigation App, or EleNa, is an altitude-aware program which can take elevation gain or loss into account when planning routes between two points. Unlike traditional mapping applications, EleNA allows users to specify a threshold distance that will search for the maximal or minimal elevation gain or loss.

## Operating Environment

The operating environment of EleNA is a containerized webapp, deployable to any host. The client will be accessible via HTTP from any web browser. The backend will be callable from the frontend.

## Developer Setup

Step 0: Install Docker (https://www.docker.com)
Step 1: Run `docker-compose build`
Step 2: Run `docker-compose up`

The client will be running now on `localhost:3000` and the backend will be running on `localhost:5001`.