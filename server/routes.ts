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
  lat: number = -22.9057,
  lon: number = -43.1891
): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeather API key is not configured");
  }

  // Создаем экземпляр axios с настройками
  const apiClient = axios.create({
    timeout: 10000, // 10 секунд таймаут
    params: {
      appid: apiKey,
      lat,
      lon,
      units: "metric", // Используем метрическую систему
    },
  });

  try {
    // 1. Запрашиваем текущую погоду

    const currentResponse = await apiClient.get(
      "https://api.openweathermap.org/data/2.5/weather"
    );
    const API_KEY = "f3b5103f13f60b1d60e616a12b145d56";
    const city = "London";
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    clearTimeout(timeoutId);
    // const currentResponse = await fetch(apiUrl);

    // Проверяем структуру ответа
    if (!currentResponse.data?.main || !currentResponse.data.weather?.[0]) {
      throw new Error("Invalid current weather data structure");
    }

    const currentData = currentResponse.data;
    console.log("Получение данных с сервера: " + currentData);
    //надо вывести и посмотреть!
    console.log(currentResponse.data);

    // 2. Запрашиваем прогноз
    //с fetch тоже не получается Weather API Error: TypeError: fetch failed
    //не понятно почему вообще запрос на сервер не идет!ап
    const forecastResponse = await apiClient.get(
      "https://api.openweathermap.org/data/2.5/forecast"
    );

    if (!forecastResponse.data?.list) {
      throw new Error("Invalid forecast data structure");
    }

    const forecastData = forecastResponse.data;

    // 3. Обрабатываем прогноз
    const dailyForecasts = forecastData.list.reduce((acc: any, item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split("T")[0];

      if (!acc[dayKey] || date.getHours() === 12) {
        acc[dayKey] = item;
      }
      return acc;
    }, {});

    const forecast = Object.values(dailyForecasts)
      .slice(0, 5)
      .map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
          icon: item.weather[0].icon,
          temp: `${Math.round(item.main.temp)}°C`, // Уже в °C благодаря units=metric
        };
      });

    // 4. Формируем итоговый объект
    const today = new Date();
    return {
      location: `${currentData.name}, ${currentData.sys?.country || ""}`.trim(),
      date: today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      temperature: `${Math.round(currentData.main.temp)}°C`,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: `${currentData.main.humidity}%`,
      wind: `${Math.round(currentData.wind.speed)} m/s`,
      visibility: formatVisibility(currentData.visibility),
      pressure: formatPressure(currentData.main.pressure),
      forecast,
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw new Error(
      //он выдает ошибку для axios а не для fetch! надо посмотреть где и какая ошибка!
      axios.isAxiosError(error)
        ? `Weather API request failed: ${error.message}`
        : "Failed to process weather data"
    );
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
  app.get("/weather", async (req: Request, res: Response) => {
    try {
      // Verify authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("Запрос к /api/weather получен");

      try {
        console.log("Пытаемся получить данные погоды...");
        const weatherData = await fetchWeatherData();
        console.log("Данные успешно получены");
        res.json(weatherData);
      } catch (error) {
        console.error("Полная ошибка:", error);
        res.status(500).json({
          error: "Failed to fetch weather data",
          details: error instanceof Error ? error.message : String(error),
        });
      }
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
