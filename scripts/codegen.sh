co#!/bin/bash

# This script generates code and TypeScript types for GraphQL queries
# using the schema (from Commons) and the graphql query files in this project.
#
# Inputs:
# - /server/graphql/schema.graphql
# - /app/graphql/fragments/*.graphql
# - /app/graphql/queries/*.graphql
# Outputs:
# - /app/graphql/types.ts
#
# The script will fail if there are any diffs, so it can be used for testing.
# This clones the Commons repo, so you'll need the ssh keys to do that.

set -o errexit

cd $(dirname $0)/.. || exit 1

apollo codegen:generate \
  --localSchemaFile="server/graphql/schema.graphql" \
  --queries="app/graphql/queries/all-queries.graphql" \
  --target=typescript \
  --no-addTypename \
  --outputFlat \
  app/graphql/types.ts

# Set exit code to reflect whether this was a no-op (for CircleCI).
#diff -wB <(sort app/graphql/types.ts) <(git show HEAD:app/graphql/types.ts | sort -)

# Set exit code to reflect whether declarations/schema.d.ts also changed (for CircleCI)
#diff -wB <(sort declarations/schema.d.ts) <(git show HEAD:declarations/schema.d.ts | sort -)