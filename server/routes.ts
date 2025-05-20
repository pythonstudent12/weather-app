import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Mock weather data
const getWeatherData = () => {
  const today = new Date();
  
  // Generate forecast for the next 5 days
  const forecast = Array.from({ length: 5 }, (_, i) => {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i + 1);
    const day = forecastDate.getDay();
    
    return {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
      icon: ["wb_sunny", "cloud", "grain", "wb_cloudy", "wb_sunny"][i % 5],
      temp: `${Math.floor(15 + Math.random() * 15)}°C`
    };
  });
  
  return {
    location: "New York, US",
    date: today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    temperature: "24°C",
    description: "Sunny with some clouds",
    icon: "wb_cloudy",
    humidity: "45%",
    wind: "5 km/h",
    visibility: "10 km",
    pressure: "1013 hPa",
    forecast
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API endpoint
  app.get('/api/weather', (req, res) => {
    // In a real app, we would verify the auth token here
    // For simplicity, we're just returning weather data
    res.json(getWeatherData());
  });

  const httpServer = createServer(app);
  return httpServer;
}
