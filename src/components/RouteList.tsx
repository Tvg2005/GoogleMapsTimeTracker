import { useEffect, useState } from 'react';
import { MapPin, Trash2, Power, PowerOff } from 'lucide-react';
import { routeService } from '../services/routeService';
import type { Route } from '../types';

interface RouteListProps {
  onSelectRoute: (route: Route) => void;
  selectedRouteId?: number;
  onRefresh: () => void;
}

export function RouteList({ onSelectRoute, selectedRouteId, onRefresh }: RouteListProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, [onRefresh]);

  const loadRoutes = async () => {
    setIsLoading(true);
    const data = await routeService.getAllRoutes();
    setRoutes(data);
    setIsLoading(false);
  };

  const handleToggleActive = async (e: React.MouseEvent, id: number, isActive: boolean) => {
    e.stopPropagation();
    await routeService.toggleRouteActive(id, !isActive);
    loadRoutes();
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta rota?')) {
      await routeService.deleteRoute(id);
      loadRoutes();
      onRefresh();
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">Nenhuma rota criada ainda</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {routes.map((route) => (
        <div
          key={route.id}
          onClick={() => onSelectRoute(route)}
          className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
            selectedRouteId === route.id
              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400'
              : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {route.name}
                </h3>
                {route.is_active ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Ativa
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
                    Inativa
                  </span>
                )}
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400 truncate">
                  <span className="font-medium">De:</span> {route.origin}
                </p>
                <p className="text-gray-600 dark:text-gray-400 truncate">
                  <span className="font-medium">Para:</span> {route.destination}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => handleToggleActive(e, route.id, route.is_active)}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={route.is_active ? 'Desativar' : 'Ativar'}
              >
                {route.is_active ? (
                  <Power className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <PowerOff className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                )}
              </button>
              <button
                onClick={(e) => handleDelete(e, route.id)}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
