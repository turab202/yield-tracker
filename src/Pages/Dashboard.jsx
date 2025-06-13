import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FaSeedling as CropIcon, FaTrophy as TrophyIcon, FaCalendarAlt as SeasonIcon, FaChartLine as AnalyticsIcon, FaExchangeAlt as CompareIcon, FaFilePdf as ExportIcon, FaSun as SunIcon, FaCloudRain as RainIcon, FaTemperatureHigh as TempIcon, FaMapMarkerAlt as LocationIcon, FaUser as UserIcon, FaCog as SettingsIcon, FaHome as DashboardIcon, FaHistory as HistoryIcon, FaChartBar as ChartsIcon, FaTable as TableIcon, FaRegCalendar as CalendarIcon } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = ({ darkMode }) => {
  const [crops, setCrops] = useState([
    { id: 1, name: 'Wheat', currentYield: 1200, targetYield: 1500, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-03-15', harvestDate: '2023-07-20' },
    { id: 2, name: 'Corn', currentYield: 850, targetYield: 1000, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-04-01', harvestDate: '2023-08-15' },
    { id: 3, name: 'Soybeans', currentYield: 600, targetYield: 800, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-04-10', harvestDate: '2023-09-05' },
  ]);
  
  const [historicalData] = useState([
    { season: 'Winter 2022', Wheat: 1100, Corn: 800, Soybeans: 550 },
    { season: 'Spring 2022', Wheat: 950, Corn: 700, Soybeans: 500 },
    { season: 'Summer 2022', Wheat: 1150, Corn: 820, Soybeans: 580 },
    { season: 'Fall 2022', Wheat: 1050, Corn: 780, Soybeans: 520 },
    { season: 'Winter 2023', Wheat: 1250, Corn: 880, Soybeans: 620 },
    { season: 'Spring 2023', Wheat: 1350, Corn: 920, Soybeans: 680 },
  ]);
  
  const [forecastData, setForecastData] = useState(null);
  const [efficiencyData, setEfficiencyData] = useState([]);

  // Generate forecast based on historical data
  useEffect(() => {
    if (historicalData.length > 2) {
      const lastWheat = historicalData[historicalData.length - 1].Wheat;
      const prevWheat = historicalData[historicalData.length - 2].Wheat;
      const wheatTrend = lastWheat - prevWheat;
      
      const lastCorn = historicalData[historicalData.length - 1].Corn;
      const prevCorn = historicalData[historicalData.length - 2].Corn;
      const cornTrend = lastCorn - prevCorn;
      
      const lastSoybeans = historicalData[historicalData.length - 1].Soybeans;
      const prevSoybeans = historicalData[historicalData.length - 2].Soybeans;
      const soybeansTrend = lastSoybeans - prevSoybeans;
      
      setForecastData([
        { name: 'Winter', Wheat: 1100, Corn: 800, Soybeans: 550 },
        { name: 'Spring', Wheat: 950, Corn: 700, Soybeans: 500 },
        { name: 'Summer', Wheat: 1150, Corn: 820, Soybeans: 580 },
        { name: 'Fall', Wheat: 1050, Corn: 780, Soybeans: 520 },
        { name: 'Winter', Wheat: 1250, Corn: 880, Soybeans: 620 },
        { name: 'Spring', Wheat: 1350, Corn: 920, Soybeans: 680 },
        { name: 'Summer (Forecast)', Wheat: Math.round(lastWheat + wheatTrend * 0.8), Corn: Math.round(lastCorn + cornTrend * 0.8), Soybeans: Math.round(lastSoybeans + soybeansTrend * 0.8) }
      ]);

      setEfficiencyData([
        { name: 'Wheat', efficiency: 15, trend: 'up' },
        { name: 'Corn', efficiency: 8, trend: 'up' },
        { name: 'Soybeans', efficiency: 5, trend: 'up' },
        { name: 'Barley', efficiency: -3, trend: 'down' },
        { name: 'Rice', efficiency: 12, trend: 'up' }
      ]);
    }
  }, [historicalData]);

  const updateYield = (id, value) => {
    setCrops(crops.map(crop => 
      crop.id === id ? { ...crop, currentYield: parseFloat(value) } : crop
    ));
  };

  // Calculate performance metrics
  const performanceMetrics = crops.map(crop => ({
    ...crop,
    progress: (crop.currentYield / crop.targetYield) * 100,
    efficiency: crop.currentYield > crop.targetYield 
      ? Math.round(((crop.currentYield - crop.targetYield) / crop.targetYield) * 100)
      : 0
  }));

  // Data for pie chart
  const pieData = crops.map(crop => ({
    name: crop.name,
    value: crop.currentYield
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Crops</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{crops.length}</p>
            </div>
            <CropIcon className={`w-10 h-10 ${darkMode ? 'text-green-400' : 'text-green-600'} opacity-20`} />
          </div>
        </div>
        
        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Progress</p>
              <p className="text-3xl font-bold text-amber-600">
                {Math.round(performanceMetrics.reduce((sum, crop) => sum + crop.progress, 0) / crops.length)}%
              </p>
            </div>
            <AnalyticsIcon className={`w-10 h-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'} opacity-20`} />
          </div>
        </div>
        
        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Performer</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {performanceMetrics.reduce((max, crop) => max.progress > crop.progress ? max : crop).name}
              </p>
            </div>
            <SeasonIcon className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'} opacity-20`} />
          </div>
        </div>
        
        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Season</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                {crops[0]?.season || 'Summer 2023'}
              </p>
            </div>
            <CalendarIcon className={`w-10 h-10 ${darkMode ? 'text-amber-400' : 'text-amber-600'} opacity-20`} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Progress */}
        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Current Season Progress
            </h2>
          </div>
          <div className="space-y-4">
            {performanceMetrics.map(crop => (
              <div key={crop.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Current: {crop.currentYield} {crop.unit}
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Target: {crop.targetYield} {crop.unit}
                    </span>
                  </div>
                  
                  <div className={`w-full rounded-full h-2.5 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div
                      className={`h-2.5 rounded-full ${
                        crop.progress >= 100 
                          ? darkMode 
                            ? 'bg-green-500' 
                            : 'bg-green-400' 
                          : darkMode 
                            ? 'bg-amber-500' 
                            : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(crop.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
  <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
    Yield Distribution
  </h2>
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          // ✅ Use a plain string label instead of JSX
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={
            darkMode
              ? {
                  backgroundColor: '#1F2937',
                  borderColor: '#374151',
                  color: '#F3F4F6',
                }
              : {
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  color: '#1f2937',
                }
          }
          itemStyle={{
            color: darkMode ? '#4ade80' : '#16a34a',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
 
      </div>

      {/* Forecast and Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Card */}
        {forecastData && (
          <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Next Season Forecast
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={forecastData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={darkMode ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    } : null}
                  />
                  <Area type="monotone" dataKey="Wheat" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Corn" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Soybeans" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className={`text-xs mt-3 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Based on historical trends and seasonal patterns
            </p>
          </div>
        )}

        {/* Efficiency Card */}
        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            Crop Efficiency
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={efficiencyData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                <XAxis type="number" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis dataKey="name" type="category" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={darkMode ? { 
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#F3F4F6'
                  } : null}
                />
               
                <Bar dataKey="efficiency">
                  {efficiencyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.trend === 'up' ? (darkMode ? '#10b981' : '#10b981') : (darkMode ? '#FF0000' : '#FF0000')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={`text-xs mt-3 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Positive values indicate higher efficiency than target
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;