export interface SaferRouteRequest {
  start_lat: number;
  start_lng: number;
  target_shelter_id?: string;
  role?: string;
}

export interface SaferRouteResult {
  target_shelter_name: string;
  target_shelter_id?: string;
  total_distance_km: number;
  estimated_travel_time_mins: number;
  overall_route_safety_score: number;
  hazards_avoided: string[];
  path_coordinates: [number, number][];
  step_instructions: string[];
  disclaimer: string;
}
