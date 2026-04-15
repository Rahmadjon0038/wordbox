#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CLIENT_IMAGE="wordbox-client"
SERVER_IMAGE="wordbox-server"
CLIENT_CONTAINER="wordbox-client"
SERVER_CONTAINER="wordbox-server"

CLIENT_PORT="5000"
SERVER_PORT="5002"

read_env_value() {
  local env_file="$1"
  local key="$2"

  if [[ ! -f "${env_file}" ]]; then
    return 0
  fi

  grep -E "^${key}=" "${env_file}" | tail -n 1 | cut -d '=' -f 2- | sed 's/^["'\'']//; s/["'\'']$//'
}

CLIENT_API_URL="${CLIENT_API_URL:-$(read_env_value "${ROOT_DIR}/client/.env" "API")}"
CLIENT_API_URL="${CLIENT_API_URL:-https://apiwordbox.astrocoder.uz/}"

SERVER_CLIENT_ORIGIN="${SERVER_CLIENT_ORIGIN:-$(read_env_value "${ROOT_DIR}/server/.env" "CLIENT_ORIGIN")}"
SERVER_CLIENT_ORIGIN="${SERVER_CLIENT_ORIGIN:-http://localhost:${CLIENT_PORT}}"

echo "Docker image'lar build qilinmoqda..."
docker build \
  --build-arg API="${CLIENT_API_URL}" \
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
  -e CLIENT_ORIGIN="${SERVER_CLIENT_ORIGIN}" \
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
echo "Frontend API: ${CLIENT_API_URL}"
