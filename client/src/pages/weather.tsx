import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Cloud, CloudOff, Droplets, Eye, Gauge, RefreshCw, Wind } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

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

const WEATHER_ICONS: Record<string, React.ReactNode> = {
  "01d": <Cloud className="text-5xl text-primary" />,
  "02d": <Cloud className="text-5xl text-primary" />,
  "03d": <Cloud className="text-5xl text-primary" />,
  "04d": <Cloud className="text-5xl text-primary" />,
  "09d": <Cloud className="text-5xl text-primary" />,
  "10d": <Cloud className="text-5xl text-primary" />,
  "11d": <Cloud className="text-5xl text-primary" />,
  "13d": <Cloud className="text-5xl text-primary" />,
  "50d": <Cloud className="text-5xl text-primary" />,
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

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Weather Header */}
        <div className="bg-accent p-6 text-white">
          <h2 className="text-2xl font-medium mb-2">
            {data?.location || "Loading location..."}
          </h2>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{data?.date || "Loading date..."}</span>
          </div>
        </div>

        {/* Weather Content */}
        <div className="p-6">
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
              <div className="lg:flex items-center mb-8 border-b border-neutral-200 pb-6">
                <div className="flex-1 flex items-center justify-center lg:justify-start mb-4 lg:mb-0">
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start">
                      <Cloud className="text-5xl text-primary mr-2" />
                      <span className="text-4xl font-light">{data.temperature}</span>
                    </div>
                    <div className="text-lg text-neutral-400 mt-1">{data.description}</div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-neutral-100">
                      <div className="text-sm text-neutral-400 flex items-center">
                        <Droplets className="w-4 h-4 mr-1" />
                        Humidity
                      </div>
                      <div className="text-lg font-medium">{data.humidity}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-100">
                      <div className="text-sm text-neutral-400 flex items-center">
                        <Wind className="w-4 h-4 mr-1" />
                        Wind
                      </div>
                      <div className="text-lg font-medium">{data.wind}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-100">
                      <div className="text-sm text-neutral-400 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Visibility
                      </div>
                      <div className="text-lg font-medium">{data.visibility}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-100">
                      <div className="text-sm text-neutral-400 flex items-center">
                        <Gauge className="w-4 h-4 mr-1" />
                        Pressure
                      </div>
                      <div className="text-lg font-medium">{data.pressure}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {data.forecast.map((day, index) => (
                    <div key={index} className="p-3 rounded-lg bg-neutral-100 text-center">
                      <div className="text-sm font-medium">{day.day}</div>
                      <div className="my-2">
                        <Cloud className="mx-auto text-xl text-primary" />
                      </div>
                      <div className="text-sm">{day.temp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Weather Error */}
          {!isLoading && error && (
            <div className="py-8 text-center">
              <div className="text-error mb-2">
                <CloudOff className="w-10 h-10 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">Unable to Load Weather Data</h3>
              <p className="text-neutral-400 text-sm">Please check your connection and try again.</p>
              <Button 
                onClick={() => refetch()} 
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
