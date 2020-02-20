#!/usr/bin/env bash
#
# Author: Stefan Buck
# License: MIT
# https://gist.github.com/stefanbuck/ce788fee19ab6eb0b4447a85fc99f447
#
#
# This script accepts the following parameters:
#
# * owner
# * repo
# * tag
# * filename
# * github_api_token
#
# Script to upload a release asset using the GitHub API v3.
#
# Example:
#
# github-release-upload.sh github_api_token=TOKEN repo_slug=hey/now tag=v0.1.0 filename=./build.zip
#

# Check dependencies.
set -e

# Set Envvars Defaults:
filename="text.txt"
github_api_token="aaa"
repo_slug="test/test"
tag="0.0.0"
id="0"

# Validate settings.
[ "$TRACE" ] && set -x

CONFIG=( "$@" )

# Update Envvars using cmdline args
for line in "${CONFIG[@]}"; do
  eval "$line"
done

# Define variables.
GH_API="https://api.github.com"
GH_REPO="$GH_API/repos/$repo_slug"
GH_TAGS="$GH_REPO/releases/tags/$tag"
AUTH="Authorization: token $github_api_token"

if [[ "$tag" == 'LATEST' ]]; then
  GH_TAGS="$GH_REPO/releases/latest"
fi

# Validate token.
curl -o /dev/null -sH "$AUTH" "$GH_REPO" || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

# Read asset tags and get ID of the asset based on given filename.
echo "curl -sH ${AUTH} ${GH_TAGS}"
id=$(curl -sH "${AUTH}" "${GH_TAGS}" | jq -r '.id')
echo "Release ID: $id"
[ "$id" != "null" ] || { echo "Error: Failed to get release id for tag: $tag";  curl -sH "${AUTH}" "${GH_TAGS}" | jq . >&2; exit 1; }

# Upload asset
echo "Uploading asset... "

# Construct url
GH_ASSET="https://uploads.github.com/repos/$repo_slug/releases/$id/assets?name=$(basename "$filename")"
echo "$GH_ASSET"
echo "curl -s --data-binary @$filename -H \"Authorization: token $github_api_token\" -H \"Content-Type: application/octet-stream\" $GH_ASSET"
curl -s --data-binary @"${filename}" -H "Authorization: token ${github_api_token}" -H "Content-Type: application/octet-stream" "${GH_ASSET}"
