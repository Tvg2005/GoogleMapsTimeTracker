const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async initDatabase() {
    const response = await fetch(`${API_BASE_URL}/init-db`, {
      method: 'POST',
    });
    return response.json();
  },

  async getAllRoutes() {
    const response = await fetch(`${API_BASE_URL}/routes`);
    return response.json();
  },

  async getRouteById(id: number) {
    const response = await fetch(`${API_BASE_URL}/routes/${id}`);
    return response.json();
  },

  async createRoute(name: string, origin: string, destination: string) {
    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, origin, destination }),
    });
    return response.json();
  },

  async updateRoute(id: number, name: string, origin: string, destination: string) {
    const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, origin, destination }),
    });
    return response.json();
  },

  async toggleRouteActive(id: number, isActive: boolean) {
    const response = await fetch(`${API_BASE_URL}/routes/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });
    return response.json();
  },

  async deleteRoute(id: number) {
    const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async getTravelTimesForRoute(routeId: number, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/routes/${routeId}/travel-times?limit=${limit}`);
    return response.json();
  },

  async saveTravelTime(
    routeId: number,
    durationSeconds: number,
    durationInTrafficSeconds: number | null,
    distanceMeters: number,
    trafficCondition: string | null
  ) {
    const response = await fetch(`${API_BASE_URL}/travel-times`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routeId,
        durationSeconds,
        durationInTrafficSeconds,
        distanceMeters,
        trafficCondition,
      }),
    });
    return response.json();
  },

  async getUserSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return response.json();
  },

  async updateUserSettings(
    preparationMinutes: number,
    queryFrequencyMinutes: number,
    monitoringIntervals: string
  ) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preparationMinutes,
        queryFrequencyMinutes,
        monitoringIntervals,
      }),
    });
    return response.json();
  },

  async fetchGoogleMapsDistance(origin: string, destination: string) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(destination)}&departure_time=now&traffic_model=best_guess&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      return data.rows[0].elements[0];
    }

    throw new Error('Unable to fetch travel time from Google Maps API');
  },
};
