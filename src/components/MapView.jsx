import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { useState } from 'react';
import AnimatedMarker from './AnimatedMarker';
import shapes from '../data/decoded_route_shapes_canonical.json'; // pre-decoded shapes

const MapView = ({ vehicles }) => {
    //Coordinates for boston center
    const position = [42.3601, -71.0589];

    //TODO: Simplify the coloring for buttons, routes, vehicles etc
    //control which lines are visible via a button
    const [visibleLines, setVisibleLines] = useState(new Set(["R", "G", "B", "O", "C", "Bus"]));
    const LINE_CODES = { R: "Red", G: "Green", O: "Orange", B: "Blue", C: "Commuter", Bus: "Bus" };
    const colorMap = { R: '#DA291C', G: '#00843D', B: '#003DA5', O: '#ED8B00' , C: '#80276C' , Bus: 'black' };

    const routeIdColor = (routeId) => {
      const colorMap = {
        'Red': '#DA291C',
        'Mattapan': '#DA291C',
        'Orange': '#ED8B00',
        'Blue': '#003DA5',
        'Green-B': '#00843D',
        'Green-C': '#00843D',
        'Green-D': '#00843D',
        'Green-E': '#00843D',
      };

      if (colorMap[routeId]) return colorMap[routeId];
     //commuter rail
      if (routeId.startsWith('CR')) return '#80276C';
      //defaul color if no match
      return 'gray';

    };

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
        <MapContainer center={position} zoom={13} style={{ height: '600px', width: '100%' }}>

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Route shapes */}
          {Object.entries(shapes)
            .filter(([routeId]) => isNaN(routeId)) // optional: skip numeric routeIds (buses)
            .map(([routeId, points]) => (
              <Polyline
                key={routeId}
                positions={points.map(p => [p.lat, p.lon])}
                pathOptions={{
                  color: routeIdColor(routeId),
                  weight: 4,
                  opacity: 0.8,
                }}
              />
            ))
          }

          {visibleVehicles.map(vehicle => (
            <AnimatedMarker key={vehicle.uid} vehicle={vehicle} />
          ))}

        </MapContainer>
      </div>
    );
};

export default MapView;
