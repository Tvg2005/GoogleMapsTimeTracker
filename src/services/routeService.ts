import { api } from './api';

export const routeService = {
  getAllRoutes: api.getAllRoutes,
  getActiveRoutes: async () => {
    const routes = await api.getAllRoutes();
    return routes.filter((route: any) => route.is_active);
  },
  getRouteById: api.getRouteById,
  createRoute: api.createRoute,
  updateRoute: api.updateRoute,
  toggleRouteActive: api.toggleRouteActive,
  deleteRoute: api.deleteRoute,
  getTravelTimesForRoute: api.getTravelTimesForRoute,
  saveTravelTime: api.saveTravelTime,
  getUserSettings: api.getUserSettings,
  updateUserSettings: api.updateUserSettings,
  fetchGoogleMapsDistance: api.fetchGoogleMapsDistance,
};
