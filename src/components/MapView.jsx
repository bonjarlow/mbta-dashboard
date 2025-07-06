import { useState } from 'react';
import shapes from '../data/decoded_route_shapes_canonical.json'; // pre-decoded shapes
import AnimatedMarker from './AnimatedMarker';

import Map, { NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Source, Layer } from 'react-map-gl/maplibre';

const MapView = ({ vehicles }) => {
    //Coordinates for boston center [lat, long]
    const position = [42.3601, -71.0589];

    //TODO: Simplify the coloring for buttons, routes, vehicles etc
    //control which lines are visible via a button
    const [visibleLines, setVisibleLines] = useState(new Set(["R", "G", "B", "O", "C", "Bus"]));
    const LINE_CODES = { R: "Red", G: "Green", O: "Orange", B: "Blue", C: "Commuter", Bus: "Bus" };
    const colorMap = { R: '#DA291C', G: '#00843D', B: '#003DA5', O: '#ED8B00' , C: '#80276C' , Bus: 'black' };

    const toggleLine = (line) => {
        setVisibleLines(prev => {
            const updated = new Set(prev);
            if (updated.has(line)) {
                updated.delete(line);
            } else {
                updated.add(line);
            }
            return updated;
        });
     };

    const visibleVehicles = vehicles.filter(vehicle => {
        const lineCode = vehicle.line;

        if (visibleLines.has(lineCode)) return true;

        if (/^\d/.test(lineCode) && visibleLines.has("Bus")) return true;

        return false;
    });

    const shapeFeatures = Object.entries(shapes)
    .filter(([routeId]) => isNaN(routeId)) // optional: skip buses
    .map(([routeId, points]) => ({
      type: 'Feature',
      properties: { routeId },
      geometry: {
        type: 'LineString',
        coordinates: points.map(p => [p.lon, p.lat])
      }
    }));

    const shapeGeoJSON = {
      type: 'FeatureCollection',
      features: shapeFeatures
    };

    const routeLineLayer = {
      id: 'routes',
      type: 'line',
      paint: {
        'line-width': 4,
        'line-opacity': 0.8,
        'line-color': [
          'match',
          ['get', 'routeId'],
          'Red', '#DA291C',
          'Mattapan', '#DA291C',
          'Blue', '#003DA5',
          'Green-B', '#00843D',
          'Green-C', '#00843D',
          'Green-D', '#00843D',
          'Green-E', '#00843D',
          'Orange', '#ED8B00',
          // fallback
          '#80276C'
        ]
      }
    };

    return (
      <div>
        {/* Toggle Buttons */}
        <div style={{ marginBottom: '10px' }}>
          {["R", "G", "O", "B", "C", "Bus"].map(code => (
            <button
              key={code}
              onClick={() => toggleLine(code)}
              style={{
                backgroundColor: visibleLines.has(code) ? colorMap[code] : "#ccc",
                color: "#fff",
                marginRight: '5px',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {LINE_CODES[code]}
            </button>
          ))}
        </div>

        {/* Map */}
        <div style={{ width: '100vw', height: '100vh' }}>
          <Map
            mapLib={import('maplibre-gl')}
            initialViewState={{
              longitude: position[1],
              latitude: position[0],
              zoom: 12,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" // free, no key needed
          >
            <NavigationControl position="top-left" />

            <Source id="route-shapes" type="geojson" data={shapeGeoJSON}>
              <Layer {...routeLineLayer} />
            </Source>

            {visibleVehicles.map(vehicle => (
                <AnimatedMarker key={vehicle.uid} vehicle={vehicle} />
            ))}

          </Map>

        </div>
      </div>
    );
};

export default MapView;
