#!/bin/bash

# Deploy script for mangareader-cms on VPS
# This script is called by GitHub Actions

set -e

# Determine branch and environment
BRANCH=${BRANCH:-production}
ENVIRONMENT=${BRANCH}

# Project directory
PROJECT_DIR="/opt/mangareader-cms"

CONTAINER_NAME="mangareader-cms"
SERVICE_NAME="cms"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."
echo "📍 Branch: $BRANCH"
echo "📁 Directory: $PROJECT_DIR"

# Navigate to project directory
cd "$PROJECT_DIR" || {
    echo "❌ Directory $PROJECT_DIR not found!"
    exit 1
}

# Check and update git remote URL to use SSH if needed
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$CURRENT_REMOTE" == *"https://github.com"* ]]; then
    echo "🔧 Updating git remote to use SSH..."
    # Update with your actual repo URL
    git remote set-url origin git@github.com:pthieenlong/mangareader-cms.git
fi

# Pull latest code
echo "📥 Pulling latest code from branch $BRANCH..."
git fetch origin
git reset --hard "origin/$BRANCH"

# Check if using root docker-compose or local
if [ -f "../docker-compose.yml" ]; then
    echo "🔨 Rebuilding Docker container (using root docker-compose)..."
    cd /opt
    # Stop only the cms service, don't touch other services or volumes
    docker-compose stop "$SERVICE_NAME" || true
    docker-compose rm -f "$SERVICE_NAME" || true
    docker-compose build "$SERVICE_NAME"
    # Use --no-deps to avoid recreating dependent services
    # IMPORTANT: Never use 'docker-compose down' as it may remove volumes
    docker-compose up -d --no-deps "$SERVICE_NAME"
else
    echo "🔨 Rebuilding Docker container (using local docker-compose)..."
    # Stop only the cms service, don't touch other services or volumes
    docker-compose stop "$SERVICE_NAME" || true
    docker-compose rm -f "$SERVICE_NAME" || true
    docker-compose build "$SERVICE_NAME"
    # IMPORTANT: Never use 'docker-compose down' as it may remove volumes
    docker-compose up -d --no-deps "$SERVICE_NAME"
fi

# Cleanup: Remove dangling images, builder cache, and builder stage images
echo "🧹 Cleaning up unused Docker images..."
docker image prune -f
docker builder prune -f
# Remove builder stage images (labeled with stage=builder)
docker images --filter "label=stage=builder" -q | xargs -r docker rmi -f || true

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 10

# Show recent logs
echo "📋 Recent logs:"
docker logs "$CONTAINER_NAME" --tail 50

echo "✅ Deployment completed for $ENVIRONMENT environment!"

