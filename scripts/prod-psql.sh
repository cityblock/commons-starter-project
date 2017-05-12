#!/bin/bash

# Run this script to get a shell on the production database on Aptible.
# You have read/write access, so be careful!

set -o errexit

# Start the tunnel. Poll for the connection string.
tempfile=$(mktemp);
aptible db:tunnel commons | tee $tempfile &

# kill any remaining background processes
function cleanup() {
  kill $(jobs -p)
  rm $tempfile
  # "aptible db:tunnel" escapes the "jobs -p" kill, so we have to hunt it down.
  pkill -f 'ssh [^ ]*\.aptible.\in '
}
trap cleanup EXIT

# Wait 10 seconds for "aptible db:tunnel" to report a connection string.
conn=''
for i in $(seq 1 10); do
  sleep 1;

  if [ -e $tempfile ]; then
    if grep 'Connect at ' $tempfile; then
      conn=$(perl -ne '/Connect at (.*)/ and print "$1"' $tempfile);
      break;
    fi
  fi
done

if [ "$conn" == '' ]; then
  echo 'Unable to get connection string from aptible db:tunnel'
  exit 1
fi

psql "$conn"
