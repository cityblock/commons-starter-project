#!/bin/bash

if [ "$NODE_ENV" != "development" ]; then
  set -o errexit

  # Start the tunnel. Poll for connection details.
  tempfile=$(mktemp);
  db=$1;
  aptible db:tunnel $db --type redis | tee $tempfile &

  # kill any remaining background processes
  function cleanup() {
    kill $(jobs -p)
    rm $tempfile
    # "aptible db:tunnel" escapes the "jobs -p" kill, so we have to hunt it down.
    pkill -f 'ssh [^ ]*\.aptible.\in '
  }
  trap cleanup EXIT

  # Wait 20 seconds for "aptible db:tunnel" to report a connection.
  for i in $(seq 1 20); do
    sleep 1;

    if [ -e $tempfile ]; then
      if grep 'Password: ' $tempfile; then
        host=$(perl -ne '/\* Host: (.*)/ and print "$1"' $tempfile);
        port=$(perl -ne '/\* Port: (.*)/ and print "$1"' $tempfile);
        password=$(perl -ne '/\* Password: (.*)/ and print "$1"' $tempfile);
        break;
      fi
    fi
  done

  if [ -z "$password" ]; then
    echo 'Unable to get connection details from aptible db:tunnel'
    exit 1
  fi

  export REDIS_PORT=$port
  export REDIS_HOST=$host
  export REDIS_PASSWORD=$password
fi

yarn ts-node -P tsconfig.server.json ./scripts/run-kue-dashboard.ts
