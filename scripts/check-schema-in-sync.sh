#!/bin/bash
set -o errexit

# Generate schema.d.ts from schema.graphql and check for diffs.
# This is run from CircleCI to ensure that the two files stay in sync.

./scripts/generate-schema-types.sh

# This will return an error code if there are any changes.
if ! git diff --exit-code declarations/schema.d.ts; then
  cat <<EOF

schema.d.ts and schema.graphql are out of sync. Run:

    npx update-schema

To update schema.d.ts.

EOF
fi
