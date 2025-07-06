import { useEffect, useState } from 'react';
import { CircleMarker, Popup } from 'react-leaflet';

function AnimatedMarker({ vehicle }) {
    // train has fields: id, lat, lon, line
    const [position, setPosition] = useState([vehicle.lat, vehicle.lon]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition(prev => {
                const [prevLat, prevLon] = prev;
                const lat = prevLat + (vehicle.lat - prevLat) * 0.1;
                const lon = prevLon + (vehicle.lon - prevLon) * 0.1;
                return [lat, lon];
            });
        }, 50);

        return () => clearInterval(interval);
    }, [vehicle.lat, vehicle.lon]);

    const direction_id = vehicle.direction_id;
    const directionName = vehicle.route?.direction_names[direction_id] || 'Unknown';
    const directionDestination = vehicle.route?.direction_destinations[direction_id] || 'Unknown';

    return (
        <CircleMarker center={position} radius={8} pathOptions={{ color: vehicle.color }}>
          <Popup className={`popup-${vehicle.line.toLowerCase()}`}>
              {vehicle.route?.long_name || vehicle.route_id}<br />
              {directionName} to {directionDestination}<br />
              {vehicle.carriages.length > 0 && (
                <>Carriages: {vehicle.carriages.length}</>
              )}<br />
              {vehicle.current_status && vehicle.stop_id && (
                <>
                  {vehicle.current_status.replace(/_/g, " ")} {vehicle.stop}
                </>
              )}
          </Popup>
        </CircleMarker>
  );
};

export default AnimatedMarker;
