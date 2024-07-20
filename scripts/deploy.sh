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

lftp -e "set ssl:verify-certificate/36:9A:EB:45:25:E5:47:FE:8E:29:75:87:C4:86:F1:E8:0E:31:B5:7F no; mirror --reverse --exclude='.DS_Store' --delete './site' /httpdocs/site; put -O /httpdocs/ './index.html'; quit" --env-password "ftp://$ftpUsername@$ftpHost"