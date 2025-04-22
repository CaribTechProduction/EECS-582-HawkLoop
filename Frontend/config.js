// config.js - Configuration settings
const DEV_MODE = true;

// Use mock data instead of real backend
export const USE_MOCK_DATA = true;

export const API_URL = DEV_MODE 
  ? 'http://localhost:8000' 
  : 'https://api.hawkloop.ku.edu';

export const WS_URL = DEV_MODE 
  ? 'ws://localhost:8000/ws/vehicles/' 
  : 'wss://api.hawkloop.ku.edu/ws/vehicles/';