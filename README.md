# Elena App

## Overview

The Elevation-Based Navigation App, or EleNa, is an altitude-aware program which can take elevation gain or loss into account when planning routes between two points. Unlike traditional mapping applications, EleNA allows users to specify a threshold distance that will search for the maximal or minimal elevation gain or loss.

## Operating Environment

The operating environment of EleNA is a containerized webapp, deployable to any host. The client will be accessible via HTTP from any web browser. The backend will be callable from the frontend.

## Developer Setup

Step 0: Install Docker (https://www.docker.com)

Step 1: Run `docker-compose build`

Step 2: Run `cd elevation`

Step 3: Run `mkdir data`

Step 4: Run `docker run -t -i -v $(pwd)/data:/code/data elenaapp-elena_elevation_server /code/create-dataset.sh` to download the elevation dataset. It is 18.5 GB and takes roughly 15 minutes to download and process

Step 5: Run `cd ..`

Step 6: Run `docker-compose up`

The client will be running now on `localhost:3000` and the backend will be running on `localhost:5001`.