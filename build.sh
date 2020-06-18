#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

DOCKER_NAME=${1}
VERSION=${2}

if [[ -z "${DOCKER_NAME}" ]]; then
  DOCKER_NAME=maven.ontotext.com/blog-post-annotation-mongo
fi

if [[ -z "${VERSION}" ]]; then
  VERSION="${VERSION}$(git rev-parse --short HEAD)-$(date +%s)"
fi

TAG="${DOCKER_NAME}:${VERSION}"

echo "Building tag [${TAG}]"

docker build -t "${TAG}" "${DIR}"
