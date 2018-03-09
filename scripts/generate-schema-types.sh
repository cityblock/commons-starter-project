#!/bin/bash
set -o errexit

# This script generates declarations/schema.d.ts from schema.graphql.

BIN=./node_modules/.bin

GRAPHQL_SCHEMA=server/graphql/schema.graphql
JSON_SCHEMA=schema.json
TS_SCHEMA=declarations/schema.d.ts
OVERRIDES=../../../scripts/generate-schema-types-overrides.js

# Step 1: generate schema.json from schema.graphql (output location is hard-coded).
$BIN/apollo-codegen introspect-schema $GRAPHQL_SCHEMA

# Step 2: generate schema.d.ts from schema.json, applying some transformations.
$BIN/gql2ts $JSON_SCHEMA -e $OVERRIDES -n schema \
  | grep -v '__typename' \
  > $TS_SCHEMA

rm $JSON_SCHEMA

