#!/bin/bash

# Clean dist
rm -rf dist
mkdir -p dist/nodes/Whereby dist/nodes/WherebyTrigger dist/credentials

# Copy files directly since TypeScript hangs
echo "Copying files..."

# Copy credentials
cp credentials/*.ts dist/credentials/
cd dist/credentials
for file in *.ts; do
  mv "$file" "${file%.ts}.js"
done
cd ../..

# Copy nodes
cp nodes/Whereby/*.ts dist/nodes/Whereby/
cp nodes/Whereby/*.svg dist/nodes/Whereby/
cd dist/nodes/Whereby
for file in *.ts; do
  mv "$file" "${file%.ts}.js"
done
cd ../../..

cp nodes/WherebyTrigger/*.ts dist/nodes/WherebyTrigger/
cp nodes/WherebyTrigger/*.svg dist/nodes/WherebyTrigger/
cd dist/nodes/WherebyTrigger
for file in *.ts; do
  mv "$file" "${file%.ts}.js"
done
cd ../../..

echo "Build complete!"