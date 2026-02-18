#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p backend/storage/models/samples

# sample royalty-free small GLB files (placeholders -> user should verify licenses)
urls=(
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb"
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb"
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb"
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb"
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF-Binary/FlightHelmet.glb"
)

i=1
for u in "${urls[@]}"; do
  out="backend/storage/models/samples/sample-${i}.glb"
  echo "Downloading $u -> $out"
  curl -sSL "$u" -o "$out"
  i=$((i+1))
done

echo "Downloaded sample GLB files into backend/storage/models/samples/"
