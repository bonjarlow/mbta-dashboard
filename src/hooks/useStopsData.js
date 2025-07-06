import rawStops from '../data/mbta_stops.json';

export const stopMap = Object.fromEntries(
  rawStops.data.map(stop => [
    stop.id,
    stop.attributes.name
  ])
);
