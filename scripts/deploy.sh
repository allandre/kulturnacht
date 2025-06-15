#! /bin/bash

set -euo pipefail

cd "$(dirname "$0")/.." # projectRoot

ftpHost='kulturnacht.info'
ftpUsername=$(op read "op://Personal/Kulturnacht FTP/username")
ftpPassword=$(op read "op://Personal/Kulturnacht FTP/password")

if [ -z "$ftpUsername" ]; then
  read -r -p "Enter the ftp username for '$ftpHost':" -s ftpUsername
  echo "" # read does not add a newline when done
fi

if [ -z "$ftpPassword" ]; then
  read -r -p "Enter the ftp password for user '$ftpUsername' at '$ftpHost':" -s ftpPassword
  echo "" # read does not add a newline when done
fi

export LFTP_PASSWORD=$ftpPassword

lftp -e "set ssl:verify-certificate/37:44:88:26:9E:00:30:93:00:1A:D7:C8:12:99:1F:4C:B6:75:33:CF no; mirror --reverse --exclude='.DS_Store' --delete './site' /httpdocs/site; put -O /httpdocs/ './index.html'; quit" --env-password "ftp://$ftpUsername@$ftpHost"