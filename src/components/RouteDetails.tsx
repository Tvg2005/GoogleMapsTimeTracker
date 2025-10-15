import { useEffect, useState } from 'react';
import { Clock, Navigation, TrendingUp, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { routeService } from '../services/routeService';
import type { Route, TravelTime } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RouteDetailsProps {
  route: Route;
  onClose: () => void;
}

export function RouteDetails({ route }: RouteDetailsProps) {
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    loadTravelTimes();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [route.id]);

  const loadTravelTimes = async () => {
    setIsLoading(true);
    const data = await routeService.getTravelTimesForRoute(route.id, 100);
    setTravelTimes(data);
    setIsLoading(false);
  };

  const fetchNewTravelTime = async () => {
    try {
      const result = await routeService.fetchGoogleMapsDistance(route.origin, route.destination);
      await routeService.saveTravelTime(
        route.id,
        result.duration.value,
        result.duration_in_traffic?.value || null,
        result.distance.value,
        null
      );
      loadTravelTimes();
    } catch (error) {
      console.error('Error fetching travel time:', error);
    }
  };

  const startMonitoring = () => {
    fetchNewTravelTime();
    const id = window.setInterval(() => {
      fetchNewTravelTime();
    }, 5 * 60 * 1000);
    setIntervalId(id);
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsMonitoring(false);
  };

  const chartData = travelTimes
    .slice(0, 50)
    .reverse()
    .map((tt) => ({
      time: format(new Date(tt.query_datetime), 'HH:mm', { locale: ptBR }),
      duration: Math.round(tt.duration_seconds / 60),
      durationInTraffic: tt.duration_in_traffic_seconds
        ? Math.round(tt.duration_in_traffic_seconds / 60)
        : null,
    }));

  const avgDuration = travelTimes.length
    ? travelTimes.reduce((sum, tt) => sum + tt.duration_seconds, 0) / travelTimes.length / 60
    : 0;

  const minDuration = travelTimes.length
    ? Math.min(...travelTimes.map((tt) => tt.duration_seconds)) / 60
    : 0;

  const maxDuration = travelTimes.length
    ? Math.max(...travelTimes.map((tt) => tt.duration_seconds)) / 60
    : 0;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 dark:border-blue-400 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{route.name}</h2>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">De:</span> {route.origin}
              </p>
              <p>
                <span className="font-medium">Para:</span> {route.destination}
              </p>
            </div>
          </div>
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
              isMonitoring
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
            }`}
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Monitorar
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/60 dark:bg-gray-900/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Média</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(avgDuration)} min</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Mínimo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(minDuration)} min</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Máximo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(maxDuration)} min</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {travelTimes.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum dado coletado ainda. Clique em "Monitorar" para começar.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Histórico de Tempos ({travelTimes.length} registros)
            </h3>
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="time"
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                  />
                  <YAxis
                    label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    name="Duração"
                  />
                  {chartData.some((d) => d.durationInTraffic) && (
                    <Line
                      type="monotone"
                      dataKey="durationInTraffic"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 3 }}
                      name="Com Tráfego"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {travelTimes.slice(0, 20).map((tt) => (
                <div
                  key={tt.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(tt.query_datetime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {Math.round(tt.duration_seconds / 60)} min
                    </span>
                    {tt.duration_in_traffic_seconds && (
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {Math.round(tt.duration_in_traffic_seconds / 60)} min (tráfego)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
