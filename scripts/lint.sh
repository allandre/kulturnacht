#!/bin/bash

set -e

my_folder="$(pwd)/$(dirname "${BASH_SOURCE[0]}")"
project_root=$(dirname "${my_folder}")

cd "${project_root}" || exit 2

node_version="$(node --version)"
nvmrc="v$(cat .nvmrc)"

if [[ "${node_version}" != "${nvmrc}"* ]]; then
    echo "Wrong node version '${node_version}'. Should be '${nvmrc}'"
    exit 1
fi

npm run lint