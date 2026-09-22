"""Project the OSM download into pixel polylines, one list per class.
Reads data/osm.json and data/rel.json, writes data/geo.json (2800 px wide)."""
import json, math, pathlib

HERE = pathlib.Path(__file__).parent / 'data'
S, W0, N, E = 47.300, 8.420, 47.425, 8.680
W = 2800
k = math.cos(math.radians((S + N) / 2))
wkm, hkm = (E - W0) * k, N - S
H = round(W * hkm / wkm)

def xy(lat, lon):
    return [round((lon - W0) * k / wkm * W, 1), round((N - lat) / hkm * H, 1)]

def flat(points):
    return [v for p in points for v in xy(p['lat'], p['lon'])]

ROADS = {
    'motorway': ('motorway', 'motorway_link', 'trunk', 'trunk_link'),
    'major': ('primary', 'primary_link', 'secondary', 'secondary_link'),
    'street': ('tertiary', 'tertiary_link', 'residential', 'unclassified', 'living_street', 'pedestrian', 'road'),
    'path': ('footway', 'path', 'cycleway', 'track', 'steps', 'bridleway'),
    'service': ('service',),
}
CLASS = {hw: c for c, hws in ROADS.items() for hw in hws}
layers = {c: [] for c in ['motorway', 'major', 'street', 'path', 'service', 'river', 'stream', 'water', 'water_hole', 'wood', 'wood_hole']}

for el in json.load(open(HERE / 'osm.json'))['elements']:
    t, g = el.get('tags', {}), el.get('geometry')
    if el['type'] != 'way' or not g or len(g) < 2:
        continue
    if t.get('highway') in CLASS and t.get('tunnel') not in ('yes', 'building_passage'):
        layers[CLASS[t['highway']]].append(flat(g))
    elif t.get('waterway') in ('river', 'canal'):
        layers['river'].append(flat(g))
    elif t.get('waterway') == 'stream':
        layers['stream'].append(flat(g))
    elif t.get('natural') == 'water':
        layers['water'].append(flat(g))
    elif t.get('landuse') == 'forest' or t.get('natural') == 'wood':
        layers['wood'].append(flat(g))

def stitch(ways):
    """Join a multipolygon's member ways end to end into closed rings."""
    ways = [[(q['lat'], q['lon']) for q in w] for w in ways]
    rings = []
    while ways:
        r = ways.pop(0)
        grew = True
        while grew and r[0] != r[-1]:
            grew = False
            for i, w in enumerate(ways):
                if w[0] == r[-1]: r = r + w[1:]
                elif w[-1] == r[-1]: r = r + w[::-1][1:]
                elif w[-1] == r[0]: r = w + r[1:]
                elif w[0] == r[0]: r = w[::-1] + r[1:]
                else: continue
                ways.pop(i); grew = True; break
        rings.append([v for lat, lon in r for v in xy(lat, lon)])
    return rings

for el in json.load(open(HERE / 'rel.json'))['elements']:
    t = el.get('tags', {})
    c = 'water' if t.get('natural') == 'water' else 'wood'
    members = [m for m in el.get('members', []) if m.get('type') == 'way' and m.get('geometry')]
    layers[c] += stitch([m['geometry'] for m in members if m.get('role') in ('outer', '')])
    layers[c + '_hole'] += stitch([m['geometry'] for m in members if m.get('role') == 'inner'])

json.dump({'W': W, 'H': H, 'layers': layers}, open(HERE / 'geo.json', 'w'), separators=(',', ':'))
print(W, H, {c: len(v) for c, v in layers.items()})
