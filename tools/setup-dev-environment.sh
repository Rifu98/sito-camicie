#!/usr/bin/env bash
set -euo pipefail
# Install frontend deps and build backend for faster first start in the devcontainer
cd /workspaces/$(basename "$PWD") || cd /workspace

if [ -d frontend ]; then
  cd frontend
  npm ci || true
  cd ..
fi

if [ -d backend ]; then
  cd backend
  mvn -DskipTests package || true
  cd ..
fi

echo "Dev container setup completed. Use 'docker compose up --build' to start services."