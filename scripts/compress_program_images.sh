#! /bin/bash

set -euxo pipefail

cd "$(dirname "$0")/.." # projectRoot
cd site/resources/program-images

# delete current small versions
rm -r small/*

# create new smaller versions
for i in original/*; do
  # scale is needed to avoid color changes in "Foto 10_MSK_saxophonensemble.jpg"
  # strip is needed to avoid color changes in "Foto 16c_Robert Strubel.jpg"
  magick "$i" -define jpeg:extent=400KB -scale 1000 -strip "small/$(basename "$i")"
done

echo "successfully created small versions of all program images"