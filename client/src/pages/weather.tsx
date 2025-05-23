import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Cloud,
  CloudOff,
  Droplets,
  Eye,
  Gauge,
  RefreshCw,
  Wind,
  Sun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  CloudLightning,
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";

type WeatherData = {
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
};

// Enhanced weather icons based on OpenWeatherMap icon codes
const WEATHER_ICONS: Record<string, React.ReactNode> = {
  // Clear sky
  "01d": <Sun className="text-5xl text-yellow-500" />,
  "01n": <Sun className="text-5xl text-yellow-400 opacity-70" />,

  // Few clouds
  "02d": <Cloud className="text-5xl text-primary" />,
  "02n": <Cloud className="text-5xl text-primary opacity-70" />,

  // Scattered clouds
  "03d": <Cloud className="text-5xl text-gray-400" />,
  "03n": <Cloud className="text-5xl text-gray-400 opacity-70" />,

  // Broken clouds
  "04d": <Cloud className="text-5xl text-gray-500" />,
  "04n": <Cloud className="text-5xl text-gray-500 opacity-70" />,

  // Shower rain
  "09d": <CloudDrizzle className="text-5xl text-blue-400" />,
  "09n": <CloudDrizzle className="text-5xl text-blue-400 opacity-70" />,

  // Rain
  "10d": <CloudRain className="text-5xl text-blue-500" />,
  "10n": <CloudRain className="text-5xl text-blue-500 opacity-70" />,

  // Thunderstorm
  "11d": <CloudLightning className="text-5xl text-purple-500" />,
  "11n": <CloudLightning className="text-5xl text-purple-500 opacity-70" />,

  // Snow
  "13d": <CloudSnow className="text-5xl text-blue-200" />,
  "13n": <CloudSnow className="text-5xl text-blue-200 opacity-70" />,

  // Mist/fog
  "50d": <CloudFog className="text-5xl text-gray-300" />,
  "50n": <CloudFog className="text-5xl text-gray-300 opacity-70" />,
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Weather() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data, isLoading, error, refetch } = useQuery<WeatherData>({
    queryKey: ["/api/weather"],
    refetchOnWindowFocus: false,
  });

  if (!isAuthenticated) {
    return null;
  }

  // Function to get the appropriate weather icon
  const getWeatherIcon = (iconCode: string) => {
    return (
      WEATHER_ICONS[iconCode] || <Cloud className="text-5xl text-primary" />
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto fade-in px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Weather Header */}
        <div className="bg-primary bg-opacity-90 p-5 sm:p-7 text-white">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-wide city-name">
              {data?.location || "Loading location..."}
            </h2>
            <div className="flex items-center justify-center sm:justify-start">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">
                {data?.date || "Loading date..."}
              </span>
            </div>
          </div>
        </div>

        {/* Weather Content */}
        <div className="p-4 sm:p-6">
          {/* Weather Loading State */}
          {isLoading && (
            <div className="py-12 flex justify-center items-center text-neutral-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Weather Content */}
          {!isLoading && !error && data && (
            <div>
              {/* Current Weather */}
              <div className="flex flex-col lg:flex-row items-center mb-6 sm:mb-8 border-b border-neutral-200 pb-6">
                <div className="flex-1 flex items-center justify-center w-full lg:justify-start mb-4 lg:mb-0">
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start">
                      <div className="float">{getWeatherIcon(data.icon)}</div>
                      <span className="text-3xl sm:text-4xl font-light ml-2">
                        {data.temperature}
                      </span>
                    </div>
                    <div className="text-md sm:text-lg text-neutral-400 mt-1 capitalize text-center lg:text-left">
                      {data.description}
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-lg bg-neutral-100">
                      <div className="text-xs sm:text-sm text-neutral-400 flex items-center">
                        <Droplets className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Humidity
                      </div>
                      <div className="text-md sm:text-lg font-medium">
                        {data.humidity}
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-neutral-100">
                      <div className="text-xs sm:text-sm text-neutral-400 flex items-center">
                        <Wind className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Wind
                      </div>
                      <div className="text-md sm:text-lg font-medium">
                        {data.wind}
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-neutral-100">
                      <div className="text-xs sm:text-sm text-neutral-400 flex items-center">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Visibility
                      </div>
                      <div className="text-md sm:text-lg font-medium">
                        {data.visibility}
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-neutral-100">
                      <div className="text-xs sm:text-sm text-neutral-400 flex items-center">
                        <Gauge className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Pressure
                      </div>
                      <div className="text-md sm:text-lg font-medium">
                        {data.pressure}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Section */}
              <div>
                <h3 className="text-md sm:text-lg font-medium mb-3 sm:mb-4 text-center sm:text-left">
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                  {data.forecast.map((day, index) => (
                    <div
                      key={index}
                      className="p-2 sm:p-3 rounded-lg bg-neutral-100 text-center"
                    >
                      <div className="text-xs sm:text-sm font-medium">
                        {day.day}
                      </div>
                      <div className="my-1 sm:my-2 float">
                        {getWeatherIcon(day.icon)}
                      </div>
                      <div className="text-xs sm:text-sm">{day.temp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Weather Error */}
          {!isLoading && error && (
            <div className="py-6 sm:py-8 text-center">
              <div className="text-error mb-2">
                <CloudOff className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" />
              </div>
              <h3 className="text-md sm:text-lg font-medium mb-2">
                Unable to Load Weather Data
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm">
                Please check your connection and try again.
              </p>
              <Button
                onClick={() => refetch()}
                className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
