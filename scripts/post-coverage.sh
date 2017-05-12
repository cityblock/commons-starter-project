#!/bin/bash
# Post code coverage data to coveralls.io.
# This is intended to be run from CircleCI.

COVERALLS_SERVICE_NAME=circleci \
COVERALLS_SERVICE_JOB_ID=$CIRCLE_BUILD_NUM \
COVERALLS_GIT_COMMIT=$CIRCLE_SHA1 \
node_modules/.bin/coveralls < coverage/remapped/lcov.info
