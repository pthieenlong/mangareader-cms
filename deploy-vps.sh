#!/bin/bash

# Deploy script for mangareader-cms on VPS

set -e

BRANCH=${BRANCH:-main}
PROJECT_DIR="/opt/mangareader-cms"
CONTAINER_NAME="mangareader-cms"
SERVICE_NAME="cms"

echo "🚀 Starting deployment..."
echo "📍 Branch: $BRANCH"

cd "$PROJECT_DIR" || exit 1

# Check and update git remote URL to use SSH if needed
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$CURRENT_REMOTE" == *"https://github.com"* ]]; then
    echo "🔧 Updating git remote to use SSH..."
    git remote set-url origin git@github.com:pthieenlong/mangareader-cms.git
fi

# Pull latest code
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

# Check if using root docker-compose
if [ -f "../docker-compose.yml" ]; then
    echo "🔨 Rebuilding container..."
    cd /opt
    docker-compose stop "$SERVICE_NAME" || true
    docker-compose rm -f "$SERVICE_NAME" || true
    docker-compose build "$SERVICE_NAME"
    docker-compose up -d --no-deps "$SERVICE_NAME"
else
    echo "🔨 Rebuilding container..."
    docker-compose stop "$SERVICE_NAME" || true
    docker-compose rm -f "$SERVICE_NAME" || true
    docker-compose build "$SERVICE_NAME"
    docker-compose up -d --no-deps "$SERVICE_NAME"
fi

# Cleanup
echo "🧹 Cleaning up..."
docker image prune -f
docker builder prune -f

# Wait and show logs
echo "⏳ Waiting..."
sleep 10

echo "📋 Recent logs:"
docker logs "$CONTAINER_NAME" --tail 50

echo "✅ Deployment completed!"

