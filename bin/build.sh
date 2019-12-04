#!/usr/bin/env bash

if [[ "${TRAVIS_TAG}" ]]; then
    VER=$TRAVIS_TAG
else
    VER=$(git rev-parse --short HEAD)
fi

RELEASE="sensu-go-fatigue-check-filter_${VER}"
CHECKSUM_TXT="${RELEASE}_sha512-checksums.txt"
ARCHIVE="${RELEASE}.tar.gz"

rm -rf dist
mkdir -p dist
tar -c {lib,README.md} > "dist/${ARCHIVE}"
cd dist || exit

sha512sum "${ARCHIVE}" > "${CHECKSUM_TXT}"

cat "${CHECKSUM_TXT}"

if [[ "${TRAVIS_TAG}" ]] && [[ "${TRAVIS_REPO_SLUG}" ]] && [[ "${GITHUB_TOKEN}" ]]; then
    for f in "${ARCHIVE}" "${CHECKSUM_TXT}"; do
        echo "uploading ${f}"
        ../bin/github-release-upload.sh github_api_token="${GITHUB_TOKEN}" repo_slug="${TRAVIS_REPO_SLUG}" tag="${TRAVIS_TAG}" filename="${f}"
    done
fi
