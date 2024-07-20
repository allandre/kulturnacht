#! /bin/bash
# This script is not yet ready.

set -euo pipefail

cd "$(dirname "$0")/.." # projectRoot

# For why such complicated loop, see https://www.shellcheck.net/wiki/SC2044
while IFS= read -r -d '' cssFile
do
  echo "cssFile: $cssFile"
  # check all css classes
  # for cssClass in $(grep '\(^\| \)\.[^ :]\+' styles/style.css); do
  #   echo $cssClass
  # done

  # see https://www.shellcheck.net/wiki/SC2013
  while IFS= read -r cssClass
  do
    echo "cssClass: $cssClass"
    # filesWithThisClass=$(grep -Rl "$cssClass" --exclude-dir={.git,node_modules})
    # find ./ -not -path "*/node_modules/*" -name "*.js" | xargs grep keyword
    filesWithThisClass=$(find ./ -not -path "*/node_modules/*" \( -name "*.js" -o -name "*.html" -o -name "*.css" \) -print0 | xargs -0 grep -l "$cssClass" | sed s#//#/#g | grep -v "$cssFile")
    echo "$filesWithThisClass"
  done < <(grep -o '\(^\| \)\.[^ :]\+' < styles/style.css |  tr -d '. ' | sort -u)

  # check all css ids

done <   <(find . -type f -name '*.css' -print0)