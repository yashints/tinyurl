#!/bin/bash

# Ensure a PAT is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a Personal Access Token (PAT)."
    exit 1
fi

if [ -z "$2" ]; then
    echo "Error: Please provide a Path to the json object."
    exit 1
fi

PAT="$1"
REPO="yashints/tinyurl"
BRANCH="main"

# Read the urls.json file
urls=$(jq -c '.[]' urls.json)

# Start the routes array
routes=$(jq -n '[]')

# Iterate over each url
for url in $urls; do
  # Extract the short and long urls
  short_url=$(echo $url | jq -r '.rowKey')
  long_url=$(echo $url | jq -r '.url')

  # Create a new route object
  route=$(jq -n \
    --arg route "$short_url" \
    --arg redirect "$long_url" \
    --argjson statusCode 301 \
    '{route: $route, redirect: $redirect, statusCode: $statusCode}')

  # Add the new route to the routes array
  routes=$(echo $routes | jq --argjson route "$route" '. += [$route]')
done

# Add the routes array to the staticwebapp.config.json file
filename="staticwebapp.config.json"
jq --argjson routes "$routes" '.routes = $routes' "./frontend/$filename" > $filename

sha=$(git hash-object ./frontend/staticwebapp.config.json)

# Replace the old config file with the new one
curl -X PUT \
      -H "Authorization: bearer $PAT" \
      -H "Content-Type: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      -d '{
          "message": "Add redirect",
          "sha": "'"$sha"'",
          "committer":{"name":"Yas Adel Mehraban","email":"adel.mehrban@gmail.com"},
          "content": "'"$(base64 -w 0 "$filename")"'"
      }' \
      "https://api.github.com/repos/$REPO/contents/frontend/$filename?ref=$BRANCH"
echo "Config file updated!"

curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/yashints/tinyurl/actions/workflows/deployweb.yaml/dispatches \
  -d '{"ref":"main"}'

echo "Deployment triggered!"
