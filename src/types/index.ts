export interface Route {
  id: number;
  name: string;
  origin: string;
  destination: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TravelTime {
  id: number;
  route_id: number;
  query_datetime: string;
  duration_seconds: number;
  duration_in_traffic_seconds?: number;
  distance_meters: number;
  traffic_condition?: string;
}

export interface UserSettings {
  id: number;
  preparation_minutes: number;
  monitoring_intervals: string;
  query_frequency_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleInterval {
  start: string;
  end: string;
}

export interface TravelTimeAnalysis {
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  recommendedDepartureTime: string;
}
