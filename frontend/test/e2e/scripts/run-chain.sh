#!/bin/bash

. /usr/src/upgrade-test-scripts/env_setup.sh

# Start the chain in the background
/usr/src/upgrade-test-scripts/start_agd.sh &

# bring back chain process to foreground
wait
