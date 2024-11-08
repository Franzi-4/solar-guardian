// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface SolarFlare {
  time_tag: string;
  flux: number;
  energy: string;
  classification?: string;
}

export interface GeomagneticData {
  time_tag: string;
  kp_index: number;
  storm_level?: string;
}

export interface SolarEventData {
  flares: SolarFlare[];
  geomagnetic: GeomagneticData[];
  last_updated: string;
  alerts: string[];
}

export const fetchSolarData = async (): Promise<SolarEventData> => {
  const response = await axios.get(`${API_URL}/api/solar-data`);
  return response.data;
};