import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-map-gl/maplibre';

function AnimatedMarker({ vehicle }) {
  const [position, setPosition] = useState([vehicle.lon, vehicle.lat]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        const [prevLon, prevLat] = prev;
        const lat = prevLat + (vehicle.lat - prevLat) * 0.1;
        const lon = prevLon + (vehicle.lon - prevLon) * 0.1;
        return [lon, lat];
      });
    }, 50);

    return () => clearInterval(interval);
  }, [vehicle.lat, vehicle.lon]);

  const direction_id = vehicle.direction_id;
  const directionName = vehicle.route?.direction_names?.[direction_id] || 'Unknown';
  const directionDestination = vehicle.route?.direction_destinations?.[direction_id] || 'Unknown';

  return (
    <>
      <Marker
        longitude={position[0]}
        latitude={position[1]}
        anchor="center"
        onClick={e => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: vehicle.color,
            border: '2px solid white',
            cursor: 'pointer',
          }}
        />
      </Marker>

      {showPopup && (
        <Popup
          longitude={position[0]}
          latitude={position[1]}
          onClose={() => setShowPopup(false)}
          closeOnClick={false}
          anchor="top"
        >
          <div className={`popup-${vehicle.line.toLowerCase()}`}>
            <strong>{vehicle.route?.long_name || vehicle.route_id}</strong><br />
            {directionName} to {directionDestination}<br />
            {vehicle.carriages?.length > 0 && (
              <>Carriages: {vehicle.carriages.length}<br /></>
            )}
            {vehicle.current_status && vehicle.stop_id && (
              <>
                {vehicle.current_status.replace(/_/g, " ")} {vehicle.stop}
              </>
            )}
          </div>
        </Popup>
      )}
    </>
  );
}

export default AnimatedMarker;
