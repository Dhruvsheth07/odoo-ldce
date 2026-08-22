import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-dev-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || '',
  GOOGLE_ROUTES_API_KEY: process.env.GOOGLE_ROUTES_API_KEY || '',
  AMADEUS_CLIENT_ID: process.env.AMADEUS_CLIENT_ID || '',
  AMADEUS_CLIENT_SECRET: process.env.AMADEUS_CLIENT_SECRET || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  get hasGooglePlaces() {
    return !!this.GOOGLE_PLACES_API_KEY;
  },
  get hasAmadeus() {
    return !!this.AMADEUS_CLIENT_ID && !!this.AMADEUS_CLIENT_SECRET;
  },
  get hasCloudinary() {
    return !!this.CLOUDINARY_CLOUD_NAME && !!this.CLOUDINARY_API_KEY;
  },
  get hasGoogleRoutes() {
    return !!this.GOOGLE_ROUTES_API_KEY;
  }
};

export default env;
