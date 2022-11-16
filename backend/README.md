# Elena Backend

## Getting Started

Please see the README file in the root directory of the project for how to run the entire app with Docker and Docker-Compose.

## Testing
Ensure that the docker container for the backend is running. Then,
from the command line, run the following command: `docker exec -it elena-backend pytest --cov-report term --cov-report html:src/test/coverage_report --cov=src`

Mocking is used in order to not call the live database or other dependencies. Please see: https://changhsinlee.com/pytest-mock/ for more information on how this is implemented.