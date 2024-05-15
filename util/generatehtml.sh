#!/bin/bash

# Usage: ./generate_redirects.sh <PAT>
# Example: ./generate_redirects.sh your_personal_access_token

# Ensure a PAT is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a Personal Access Token (PAT)."
    exit 1
fi

PAT="$1"
REPO="yashints/tinyurl"
BRANCH="main"

# Replace with your actual JSON URL
JSON_URL="https://raw.githubusercontent.com/yashints/tinyurl/main/urls.json"

# Fetch the JSON data
JSON_DATA=$(curl -s "$JSON_URL")

function processRow() {
  short=$1
  url=$2

  cat <<EOF > "${short}.html"
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
    Redirecting to ${url}...
</body>
</html>
EOF

  # Push the HTML file to the repo
  filename="${short}.html"
  curl -X PUT \
      -H "Authorization: bearer $PAT" \
      -H "Content-Type: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      -d '{
          "message": "Add redirect",
          "committer":{"name":"Yas Adel Mehraban","email":"adel.mehrban@gmail.com"},
          "content": "'"$(base64 -w 0 "$filename")"'"
      }' \
      "https://api.github.com/repos/$REPO/contents/frontend/public/$filename?ref=$BRANCH"
}

# Create HTML files
for row in $(echo "$JSON_DATA" | jq -r '.[] | tojson'); do
  processRow $(echo $row | jq -r '.rowKey') $(echo $row | jq -r '.url')
done

echo "HTML files created and pushed to the repository!"
