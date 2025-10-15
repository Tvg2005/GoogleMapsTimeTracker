import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { routeService } from '../services/routeService';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [preparationMinutes, setPreparationMinutes] = useState(15);
  const [queryFrequency, setQueryFrequency] = useState(5);
  const [intervals, setIntervals] = useState('08:00-09:00,18:00-19:00');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await routeService.getUserSettings();
    if (data) {
      setPreparationMinutes(data.preparation_minutes);
      setQueryFrequency(data.query_frequency_minutes);
      setIntervals(data.monitoring_intervals);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSaving(true);

    try {
      await routeService.updateUserSettings(
        preparationMinutes,
        queryFrequency,
        intervals
      );
      setMessage('Configurações salvas com sucesso!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage('Erro ao salvar configurações');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-xl ${
                message.includes('sucesso')
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
              }`}
            >
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tempo de Preparação (minutos)
            </label>
            <input
              type="number"
              value={preparationMinutes}
              onChange={(e) => setPreparationMinutes(Number(e.target.value))}
              min="0"
              max="120"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tempo necessário para se preparar antes de sair
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequência de Consulta (minutos)
            </label>
            <input
              type="number"
              value={queryFrequency}
              onChange={(e) => setQueryFrequency(Number(e.target.value))}
              min="1"
              max="60"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Intervalo entre consultas da API do Google Maps
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Intervalos de Monitoramento
            </label>
            <input
              type="text"
              value={intervals}
              onChange={(e) => setIntervals(e.target.value)}
              placeholder="08:00-09:00,18:00-19:00"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Formato: HH:MM-HH:MM, separados por vírgula
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
              API do Google Maps
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
              A chave de API está configurada nas variáveis de ambiente.
            </p>
            <code className="block bg-white/50 dark:bg-gray-900/50 px-3 py-2 rounded-lg text-xs text-blue-900 dark:text-blue-300">
              VITE_GOOGLE_MAPS_API_KEY
            </code>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
