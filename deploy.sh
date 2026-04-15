#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CLIENT_IMAGE="wordbox-client"
SERVER_IMAGE="wordbox-server"
CLIENT_CONTAINER="wordbox-client"
SERVER_CONTAINER="wordbox-server"

CLIENT_PORT="5000"
SERVER_PORT="5002"

echo "Docker image'lar build qilinmoqda..."
docker build \
  --build-arg API="http://localhost:${SERVER_PORT}" \
  -t "${CLIENT_IMAGE}" "${ROOT_DIR}/client"
docker build -t "${SERVER_IMAGE}" "${ROOT_DIR}/server"

recreate_container() {
  local container_name="$1"
  shift

  if docker ps -a --format '{{.Names}}' | grep -Fxq "${container_name}"; then
    echo "${container_name} container'i yangilanmoqda..."
    docker rm -f "${container_name}" >/dev/null
  fi

  docker run -d --name "${container_name}" "$@"
}

echo "Server container ishga tushirilmoqda..."
recreate_container \
  "${SERVER_CONTAINER}" \
  -p "${SERVER_PORT}:${SERVER_PORT}" \
  -e PORT="${SERVER_PORT}" \
  -e CLIENT_ORIGIN="http://localhost:${CLIENT_PORT}" \
  "${SERVER_IMAGE}"

echo "Client container ishga tushirilmoqda..."
recreate_container \
  "${CLIENT_CONTAINER}" \
  -p "${CLIENT_PORT}:${CLIENT_PORT}" \
  -e PORT="${CLIENT_PORT}" \
  "${CLIENT_IMAGE}"

echo "Tayyor:"
echo "Client: http://localhost:${CLIENT_PORT}"
echo "Server: http://localhost:${SERVER_PORT}"
