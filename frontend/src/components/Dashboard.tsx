// src/components/Dashboard.tsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, AlertTriangle, Activity, Shield, Globe, Loader } from 'lucide-react';
import { fetchSolarData, type SolarEventData } from '../services/api';

export const Dashboard = () => {
  const [data, setData] = useState<SolarEventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateData = async () => {
      try {
        const result = await fetchSolarData();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch solar data');
      } finally {
        setLoading(false);
      }
    };

    updateData();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFlareClass = (flux: number): string => {
    if (flux >= 1e-4) return 'X-class';
    if (flux >= 1e-5) return 'M-class';
    if (flux >= 1e-6) return 'C-class';
    if (flux >= 1e-7) return 'B-class';
    return 'A-class';
  };

  const getFlareDescription = (flareClass: string): string => {
    switch (flareClass) {
      case 'X-class':
        return 'Major event. Can trigger radio blackouts and radiation storms. (≥ 10⁻⁴ W/m²)';
      case 'M-class':
        return 'Medium-sized. Can cause brief radio blackouts. (≥ 10⁻⁵ W/m²)';
      case 'C-class':
        return 'Common event. Minor impact on Earth. (≥ 10⁻⁶ W/m²)';
      case 'B-class':
        return 'Minor event. No significant Earth impact. (≥ 10⁻⁷ W/m²)';
      case 'A-class':
        return 'Background level. Very minimal activity. (< 10⁻⁷ W/m²)';
      default:
        return 'Unknown classification';
    }
  };

  const getFlareColor = (flareClass: string): string => {
    switch (flareClass) {
      case 'X-class': return 'text-red-400';
      case 'M-class': return 'text-orange-400';
      case 'C-class': return 'text-yellow-400';
      case 'B-class': return 'text-green-400';
      case 'A-class': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F172A]">
        <Loader className="h-32 w-32 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-gray-100 p-8">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const latestFlare = data.flares[data.flares.length - 1];
  const currentClass = latestFlare ? getFlareClass(latestFlare.flux) : 'Unknown';
  const flareColor = getFlareColor(currentClass);

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-[#1E293B] flex flex-col items-center py-8 space-y-8">
        <Globe className="w-8 h-8 text-blue-400" />
        <Sun className="w-8 h-8 text-yellow-400" />
        <Shield className="w-8 h-8 text-green-400" />
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Solar Guardian
              </h1>
              <p className="text-gray-400 mt-1">Real-time Solar Activity Monitor</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-[#1E293B] rounded-lg px-4 py-2">
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-lg font-semibold text-blue-400">
                  {new Date(data.last_updated).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Activity Card */}
            <div className="bg-[#1E293B] rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400">Current Activity</p>
                  <p className={`text-2xl font-bold mt-2 ${flareColor}`}>
                    {currentClass}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {getFlareDescription(currentClass)}
                  </p>
                </div>
                <Sun className={`w-8 h-8 ${flareColor}`} />
              </div>
            </div>

            {/* Classification Guide */}
            <div className="bg-[#1E293B] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Solar Flare Scale</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <span>X-class: Major events</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
                  <span>M-class: Medium events</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <span>C-class: Common events</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span>B-class: Minor events</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <span>A-class: Background level</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-[#1E293B] rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400">System Status</p>
                  <p className={`text-2xl font-bold mt-2 ${data.alerts.length === 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.alerts.length === 0 ? 'Normal' : 'Alert'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {data.alerts.length} active alerts
                  </p>
                </div>
                <Activity className={`w-8 h-8 ${data.alerts.length === 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#1E293B] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Solar Flux Trends</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.flares}>
                  <defs>
                    <linearGradient id="fluxGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time_tag" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    stroke="#9CA3AF"
                  />
                  <YAxis 
                    scale="log"
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => value.toExponential(1)}
                    stroke="#9CA3AF"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: number) => [value.toExponential(2), 'Solar Flux']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="flux" 
                    stroke="#60A5FA" 
                    fill="url(#fluxGradient)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-[#1E293B] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">System Alerts</h2>
            {data.alerts.length > 0 ? (
              <div className="space-y-4">
                {data.alerts.map((alert, index) => (
                  <div key={index} className="bg-[#0F172A] rounded-lg p-4 flex items-center border border-yellow-500/20">
                    <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
                    <p className="text-gray-300">{alert}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0F172A] rounded-lg p-4 flex items-center">
                <Shield className="w-6 h-6 text-green-400 mr-3" />
                <p className="text-gray-300">All systems operating normally</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;