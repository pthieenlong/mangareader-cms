#!/bin/bash

# Deploy script for mangareader-cms on VPS
# This script pulls pre-built Docker images from GitHub Container Registry

set -e

# Rollback support
PREVIOUS_IMAGE=""

# Cleanup function for errors
cleanup_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "❌ Deployment failed with exit code: $exit_code"

        if [ -n "$PREVIOUS_IMAGE" ] && [ "${AUTO_ROLLBACK:-1}" = "1" ]; then
            echo "🔄 Attempting automatic rollback to previous image..."
            docker tag "$PREVIOUS_IMAGE" ghcr.io/pthieenlong/mangareader-cms:rollback
            $DOCKER_COMPOSE up -d cms
            echo "⚠️ Rolled back to previous version"
        fi
    fi
}

trap cleanup_on_error EXIT ERR

echo "🚀 Starting deployment..."

# Detect docker-compose command (v1 or v2)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
    echo "🐳 Using docker-compose (v1)"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
    echo "🐳 Using docker compose (v2)"
else
    echo "❌ Neither docker-compose nor docker compose found!"
    exit 1
fi

# Navigate to project directory
cd /opt/mangareader-cms || exit 1

# Check and update git remote URL to use SSH if needed
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$CURRENT_REMOTE" == *"https://github.com"* ]]; then
    echo "🔧 Updating git remote to use SSH..."
    git remote set-url origin git@github.com:pthieenlong/mangareader-cms.git
fi

# Determine branch
BRANCH=${BRANCH:-dev}
echo "📍 Branch: $BRANCH"

# Pull latest code (for docker-compose.yml and this script)
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

# Determine image tag to use
if [ -z "$IMAGE_TAG" ]; then
    # Default based on branch
    if [ "$BRANCH" = "main" ]; then
        IMAGE_TAG="latest"
    else
        IMAGE_TAG="$BRANCH"
    fi
    echo "📦 Using default image tag: $IMAGE_TAG"
else
    echo "📦 Using image tag from CI/CD: $IMAGE_TAG"
fi

export IMAGE_TAG

# Login to GitHub Container Registry (using GitHub token if available)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 Logging in to GitHub Container Registry..."
    GITHUB_USERNAME="${GITHUB_USERNAME:-pthieenlong}"
    echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin
else
    echo "⚠️  GITHUB_TOKEN not set. Assuming public image or already logged in."
fi

# Save current image for rollback
if docker ps --format '{{.Names}}' | grep -q '^mangareader-cms$'; then
    PREVIOUS_IMAGE=$(docker inspect mangareader-cms --format='{{.Image}}' 2>/dev/null || echo "")
    if [ -n "$PREVIOUS_IMAGE" ]; then
        echo "💾 Saved current image for rollback: $PREVIOUS_IMAGE"
    fi
fi

# Check if using root docker-compose or local
if [ -f "../docker-compose.yml" ] || [ -f "../docker-compose.root.yml" ]; then
    echo "📥 Pulling latest Docker image (using root docker-compose)..."
    cd /opt

    # Use docker-compose.root.yml if it exists, otherwise use docker-compose.yml
    COMPOSE_FILE=""
    if [ -f "docker-compose.root.yml" ]; then
        COMPOSE_FILE="-f docker-compose.root.yml"
    fi

    $DOCKER_COMPOSE $COMPOSE_FILE pull cms

    echo "🔄 Restarting CMS container..."
    # Stop and remove the container (keeps volumes)
    $DOCKER_COMPOSE $COMPOSE_FILE stop cms 2>&1 || true
    $DOCKER_COMPOSE $COMPOSE_FILE rm -f cms 2>&1 || true
    # Start with new image using --no-deps to avoid affecting other services
    $DOCKER_COMPOSE $COMPOSE_FILE up -d --no-deps cms 2>&1
else
    echo "📥 Pulling latest Docker image (using local docker-compose)..."
    $DOCKER_COMPOSE pull cms

    echo "🔄 Restarting CMS container..."
    # Stop and remove the container (keeps volumes)
    $DOCKER_COMPOSE stop cms 2>&1 || true
    $DOCKER_COMPOSE rm -f cms 2>&1 || true
    # Start with new image
    $DOCKER_COMPOSE up -d cms 2>&1
fi

# Optional cleanup: Remove dangling images
if [ "${CLEAN_DOCKER_IMAGES:-0}" = "1" ]; then
    echo "🧹 Cleaning up unused Docker images..."
    docker image prune -f
else
    echo "🧹 Skipping Docker image cleanup (set CLEAN_DOCKER_IMAGES=1 to enable)."
fi

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 10

# Show recent logs
echo "📋 Recent logs:"
docker logs mangareader-cms --tail 50

# Show deployment info
echo ""
echo "✅ Deployment completed successfully!"
echo "📦 Image: ghcr.io/pthieenlong/mangareader-cms:${IMAGE_TAG}"
echo "🔗 CMS URL: http://localhost:5173"

# Disable trap on successful completion
trap - EXIT ERR

# Optional: Print rollback command for reference
if [ -n "$PREVIOUS_IMAGE" ]; then
    echo ""
    echo "💡 To rollback to previous version if needed:"
    echo "   docker tag $PREVIOUS_IMAGE ghcr.io/pthieenlong/mangareader-cms:rollback"
    echo "   cd /opt && $DOCKER_COMPOSE up -d cms"
fi

