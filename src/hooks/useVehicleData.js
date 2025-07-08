import { useState, useEffect } from 'react';
import { routeMap } from '../hooks/useRouteData';
import { stopMap } from '../hooks/useStopsData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/vehicles';

const useVehicleData = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchAndParseVehicles = () => {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          const vehiclePoints = data.data || [];
          const parsedVehicles = [];

          for (const v of vehiclePoints) {
            const lat = v.attributes.latitude;
            const lon = v.attributes.longitude;
            if (lat && lon) {
              const current_status = v.attributes.current_status;
              const route_id = v.relationships.route.data.id;
              const lineCode = isNaN(parseInt(route_id[0])) ? route_id[0] : 'Bus';
              const direction_id = v.attributes.direction_id;
              const bearing = v.attributes.bearing;
              const occupancy = v.attributes.occupancy_status || null;
              const carriages = v.attributes.carriages || [];
              const route = routeMap[route_id];
              const color = route?.color ? `#${route.color}` : '#000000';
              const stop_id = v.relationships.stop?.data?.id ?? null;
              const stop = stopMap[stop_id];
              const trip_id = v.relationships.trip.data.id;

              parsedVehicles.push({
                uid: v.id,
                line: lineCode,
                lat,
                lon,
                bearing,
                current_status,
                direction_id,
                carriages,
                occupancy,
                route_id,
                route,
                color,
                stop_id,
                stop,
                trip_id
              });
            }
          }

          setVehicles(parsedVehicles);
        })
        .catch((err) => console.error("Error fetching vehicles:", err));
    };

    fetchAndParseVehicles(); // initial fetch

    const intervalId = setInterval(fetchAndParseVehicles, 30000); // every 30 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return { vehicles };
};

export default useVehicleData;
