#! /bin/bash

set -euxo pipefail

cd "$(dirname "$0")/.." # projectRoot

if [ -n "$(git status --porcelain)" ]; then
  echo "Error git needs to be clean before running tests."
  exit 1
fi

node ./scripts/programm/generate_program_html.mjs

if [ -n "$(git status --porcelain)" ]; then
  echo "Error git should not contain changes after runing generate_program_html.mjs."
  exit 1
fi

echo "All tests were successful."