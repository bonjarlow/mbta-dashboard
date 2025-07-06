import rawRoutes from '../data/mbta_routes.json';

export const routeMap = Object.fromEntries(
  rawRoutes.data.map(route => [
    route.id,
    {
      color: route.attributes.color,
      direction_destinations: route.attributes.direction_destinations,
      direction_names: route.attributes.direction_names,
      long_name: route.attributes.long_name,
      short_name: route.attributes.short_name,
      description: route.attributes.description,
    },
  ])
);
