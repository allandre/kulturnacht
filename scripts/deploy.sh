#!/bin/bash
# this script uploads the current state to the remote ftp server at kulturnacht.info

# username=${FTP_USERNAME:?}
# password=${FTP_PASSWORD:?}




my_folder="$(pwd)/$(dirname ${BASH_SOURCE[0]})"
project_root=$(dirname "${my_folder}")

cd "$project_root" || exit 1

files_to_upload=("index.html" "script.js" "styles") # and folders "resources"
for file in "${files_to_upload[@]}"; do
    echo "Uploading everything in '${file}'";

    # upload each file individually
    find "${file}" -type f -print0 | while read -d $'\0' actual_file
    do
        echo "Uploading '$actual_file'";
        directory=$(dirname "$actual_file");
        echo "curl --user ftpkulturna0a34:E5eHA9eNYWa --ftp-create-dirs --silent --upload-file '${actual_file}' 'ftp://kulturnacht.info/httpdocs2/${directory}'"
        curl --user ftpkulturna0a34:E5eHA9eNYWa --ftp-create-dirs --silent --upload-file "${actual_file}" "ftp://kulturnacht.info/httpdocs2/${directory}/";
    done

    echo "";
done

echo "Done deploying to $host";

# find mydir -type f -exec curl -u xxx:psw --ftp-create-dirs -T {} ftp://192.168.1.158/public/demon_test/{} \;

#rsync --recursive --verbose --delete --force --progress --human-readable -e 'ssh -p 21' "." "${username}@kulturnacht.info:/httpdocs/test" --exclude "info" --exclude "node_modules" --exclude "*.DS_Store"

#rsync --recursive --verbose --delete ~/Desktop/Programmierung/Web/meineWebseite milan@MiBServer:/var/www/homepage/ --exclude "meineWebseite/.git" --exclude "meineWebseite/additional" --exclude "*.DS_Store" --exclude "meineWebseite/deployWebsite.command"

#rsync -rv --delete ~/Desktop/Programmierung/Web/meineWebseite milan@MiBServer:/var/www/homepage/ --exclude "meineWebseite/.git" --exclude "meineWebseite/additional" --exclude "*.DS_Store" --exclude "meineWebseite/deployWebsite.command"