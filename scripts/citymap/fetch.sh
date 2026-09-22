#!/bin/sh
# Download Zurich's streets, paths, water and forest from OpenStreetMap (Overpass).
# Output: scripts/citymap/data/osm.json and rel.json (gitignored, ~70 MB).
set -e
cd "$(dirname "$0")"; mkdir -p data
BBOX='47.300,8.420,47.425,8.680'
UA='runthenumbers-citymap/1.0 (https://runthenumbers.ch)'
API=https://overpass-api.de/api/interpreter
get() { curl -sf -m 300 -A "$UA" -H 'Accept: application/json' --data-urlencode "data=$2" "$API" -o "data/$1"; }
get osm.json "[out:json][timeout:180];(way[\"highway\"]($BBOX);way[\"natural\"=\"water\"]($BBOX);way[\"waterway\"~\"river|stream|canal\"]($BBOX);way[\"landuse\"=\"forest\"]($BBOX);way[\"natural\"=\"wood\"]($BBOX););out tags geom qt;"
get rel.json "[out:json][timeout:180];(relation[\"natural\"=\"water\"]($BBOX);relation[\"landuse\"=\"forest\"]($BBOX);relation[\"natural\"=\"wood\"]($BBOX););out geom;"
echo "fetched: $(du -h data/osm.json | cut -f1) + $(du -h data/rel.json | cut -f1)"
