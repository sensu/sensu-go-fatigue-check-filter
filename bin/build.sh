#!/usr/bin/env bash

# Assume you're only coming here with a tag
VER=$(git describe --tags)

RELEASE="sensu-go-fatigue-check-filter_${VER}"
CHECKSUM_TXT="${RELEASE}_sha512-checksums.txt"
ARCHIVE="${RELEASE}.tar.gz"

rm -rf dist
mkdir -p dist
tar -c {lib,README.md} > "dist/${ARCHIVE}"
cd dist || exit

sha512sum "${ARCHIVE}" > "${CHECKSUM_TXT}"

cat "${CHECKSUM_TXT}"

if [[ "${GITHUB_TOKEN}" ]]; then
    for f in "${ARCHIVE}" "${CHECKSUM_TXT}"; do
        echo "uploading ${f}"
        ../bin/github-release-upload.sh github_api_token="${GITHUB_TOKEN}" repo_slug="${GITHUB_REPOSITORY}" tag="${VER}" filename="${f}"
    done
fi
