import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { storage } from "./storage";

// Weather data interface
interface WeatherData {
  location: string;
  date: string;
  temperature: string;
  description: string;
  icon: string;
  humidity: string;
  wind: string;
  visibility: string;
  pressure: string;
  forecast: Array<{
    day: string;
    icon: string;
    temp: string;
  }>;
}

// Convert Kelvin to Celsius
function kelvinToCelsius(kelvin: number): string {
  return `${Math.round(kelvin - 273.15)}°C`;
}

// Format visibility (in meters) to km
function formatVisibility(visibility: number): string {
  return `${(visibility / 1000).toFixed(1)} km`;
}

// Format pressure
function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

// Get weather data from OpenWeatherMap API
async function fetchWeatherData(
  lat: number = 55.7558, // Москва по умолчанию
  lon: number = 37.6173
): Promise<WeatherData> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    console.log("API Key:", apiKey);

    if (!apiKey) {
      throw new Error("OpenWeather API key is not configured");
    }
    console.log("API Key:", process.env.OPENWEATHER_API_KEY);

    // Current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const currentWeatherResponse = await axios.get(currentWeatherUrl);
    const currentData = currentWeatherResponse.data;

    // 5-day forecast (3-hour steps)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const forecastResponse = await axios.get(forecastUrl);
    const forecastData = forecastResponse.data;

    // Process forecast data to get daily forecasts
    const dailyForecasts: { [key: string]: any } = {};

    // Process the forecast data (it comes in 3-hour increments)
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split("T")[0];

      // Only take the first entry for each day (around noon if possible)
      if (
        !dailyForecasts[dayKey] ||
        Math.abs(date.getHours() - 12) <
          Math.abs(new Date(dailyForecasts[dayKey].dt * 1000).getHours() - 12)
      ) {
        dailyForecasts[dayKey] = item;
      }
    });

    // Format the forecast data
    const forecast = Object.values(dailyForecasts)
      .slice(0, 5)
      .map((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          date.getDay()
        ];

        return {
          day: dayOfWeek,
          icon: item.weather[0].icon,
          temp: kelvinToCelsius(item.main.temp),
        };
      });

    const today = new Date();

    return {
      location: `${currentData.name}, ${currentData.sys.country}`,
      date: today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      temperature: kelvinToCelsius(currentData.main.temp),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: `${currentData.main.humidity}%`,
      wind: `${Math.round(currentData.wind.speed)} m/s`,
      visibility: formatVisibility(currentData.visibility),
      pressure: formatPressure(currentData.main.pressure),
      forecast,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

// Fallback to mock data if API call fails
const getMockWeatherData = (): WeatherData => {
  const today = new Date();

  // Generate forecast for the next 5 days
  const forecast = Array.from({ length: 5 }, (_, i) => {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i + 1);
    const day = forecastDate.getDay();

    return {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
      icon: ["01d", "02d", "03d", "04d", "10d"][i % 5],
      temp: `${Math.floor(15 + Math.random() * 15)}°C`,
    };
  });

  return {
    location: "New York, US",
    date: today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    temperature: "24°C",
    description: "Sunny with some clouds",
    icon: "02d",
    humidity: "45%",
    wind: "5 m/s",
    visibility: "10 km",
    pressure: "1013 hPa",
    forecast,
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API endpoint
  app.get("/api/weather", async (req: Request, res: Response) => {
    try {
      // Verify authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get weather data from API
      const weatherData = await fetchWeatherData();
      res.json(weatherData);
    } catch (error) {
      console.error("Error in weather API:", error);
      res.status(500).json({
        error: "Failed to fetch weather data",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
