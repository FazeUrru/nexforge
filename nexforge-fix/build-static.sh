#!/bin/bash
# Build script for GitHub Pages static export
# Temporarily removes API routes since they can't be statically exported

set -e

echo "🔧 Preparing static build for GitHub Pages..."

API_DIR="src/app/api"
BACKUP_DIR=".api-backup"

# Backup API routes
if [ -d "$BACKUP_DIR" ]; then
  rm -rf "$BACKUP_DIR"
fi
cp -r "$API_DIR" "$BACKUP_DIR"

# Remove entire API directory (can't be statically exported with force-dynamic)
rm -rf "$API_DIR"

echo "📦 Building static site..."
NEXT_STATIC_EXPORT=true npx next build

echo "✅ Adding .nojekyll..."
touch out/.nojekyll

# Restore original API routes
echo "🔄 Restoring API routes..."
rm -rf "$API_DIR"
cp -r "$BACKUP_DIR" "$API_DIR"
rm -rf "$BACKUP_DIR"

# Verify restoration
if [ -f "$API_DIR/chat/route.ts" ] && [ -f "$API_DIR/health/route.ts" ]; then
  echo "✅ API routes restored successfully"
else
  echo "❌ WARNING: API routes may not have been restored correctly"
fi

echo "✅ Static build complete! Output in ./out/"
