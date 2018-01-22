#!/bin/bash

# This script generates code and TypeScript types for GraphQL queries
# using the schema (from Commons) and the graphql query files in this project.
#
# Inputs:
# - /server/graphql/schema.graphql
# - /app/graphql/fragments/*.graphql
# - /app/graphql/queries/*.graphql
# Outputs:
# - /app/documents.json
# - /app/graphql/types.ts
#
# The script will fail if there are any diffs, so it can be used for testing.
# This clones the Commons repo, so you'll need the ssh keys to do that.

set -o errexit

cd $(dirname $0)/.. || exit 1

ROOT=$PWD
PLATFORM=$(uname)

# Use `greadlink` if on Mac, `readlink` if on Linux
if [ "$PLATFORM" == 'Darwin' ]; then
  READLINK='greadlink'
else
  READLINK='readlink'
fi

APOLLO_CODEGEN=$($READLINK -f $(which apollo-codegen))
GRAPHQL_DOCUMENT_COLLECTOR=$($READLINK -f $(which graphql-document-collector))

# Run graphql-document-collector to parse all our GraphQL files.
# This does some smart things, e.g. bundling queries with the fragments they use.
graphql-document-collector \
  'app/graphql/**/*.graphql' \
  > app/documents.json

$APOLLO_CODEGEN introspect-schema server/graphql/schema.graphql  # generates schema.json

$APOLLO_CODEGEN \
  generate $(ls app/graphql/**/*.graphql | sort) \
  --schema schema.json \
  --target typescript \
  --output app/graphql/types.ts

rm schema.json

# Set exit code to reflect whether this was a no-op (for CircleCI).
diff -wB <(sort app/graphql/types.ts) <(git show HEAD:app/graphql/types.ts | sort -)
