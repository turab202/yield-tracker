import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FaSeedling as CropIcon, FaTrophy as TrophyIcon, FaCalendarAlt as SeasonIcon, FaChartLine as AnalyticsIcon, FaExchangeAlt as CompareIcon, FaFilePdf as ExportIcon, FaSun as SunIcon, FaCloudRain as RainIcon, FaTemperatureHigh as TempIcon, FaMapMarkerAlt as LocationIcon, FaUser as UserIcon, FaCog as SettingsIcon, FaHome as DashboardIcon, FaHistory as HistoryIcon, FaChartBar as ChartsIcon, FaTable as TableIcon, FaRegCalendar as CalendarIcon, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = ({ darkMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCrops, setHasCrops] = useState(false);
  const [crops, setCrops] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Demo data for new users
  const demoCrops = [
    { _id: 1, cropName: 'Wheat', quantity: 1200, targetYield: 1500, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-03-15', harvestDate: '2023-07-20' },
    { _id: 2, cropName: 'Corn', quantity: 850, targetYield: 1000, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-04-01', harvestDate: '2023-08-15' },
    { _id: 3, cropName: 'Soybeans', quantity: 600, targetYield: 800, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-04-10', harvestDate: '2023-09-05' },
    { _id: 4, cropName: 'Rice', quantity: 900, targetYield: 1100, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-03-20', harvestDate: '2023-08-10' },
    { _id: 5, cropName: 'Barley', quantity: 700, targetYield: 900, unit: 'kg', season: 'Summer 2023', plantedDate: '2023-04-05', harvestDate: '2023-08-25' },
  ];

  const demoHistoricalData = [
    { season: 'Winter 2022', Wheat: 1100, Corn: 800, Soybeans: 550 },
    { season: 'Spring 2022', Wheat: 950, Corn: 700, Soybeans: 500 },
    { season: 'Summer 2022', Wheat: 1150, Corn: 820, Soybeans: 580 },
    { season: 'Fall 2022', Wheat: 1050, Corn: 780, Soybeans: 520 },
    { season: 'Winter 2023', Wheat: 1250, Corn: 880, Soybeans: 620 },
    { season: 'Spring 2023', Wheat: 1350, Corn: 920, Soybeans: 680 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's crops
        const yieldsResponse = await api.get('/yields');
        const userCrops = yieldsResponse.data;
        
        if (userCrops && userCrops.length > 0) {
          setHasCrops(true);
          setCrops(userCrops);
          
          // Fetch historical data
          const historyResponse = await api.get('/yields/historical');
          setHistoricalData(historyResponse.data);
          
          // Fetch efficiency data
          const efficiencyResponse = await api.get('/yields/efficiency');
          setEfficiencyData(efficiencyResponse.data);
          
          calculateForecast(historyResponse.data);
        } else {
          setHasCrops(false);
          setCrops(demoCrops);
          setHistoricalData(demoHistoricalData);
          setEfficiencyData([
            { name: 'Wheat', efficiency: 15, trend: 'up' },
            { name: 'Corn', efficiency: 8, trend: 'up' },
            { name: 'Soybeans', efficiency: 5, trend: 'up' },
            { name: 'Barley', efficiency: -3, trend: 'down' },
            { name: 'Rice', efficiency: 12, trend: 'up' }
          ]);
          calculateForecast(demoHistoricalData);
        }
      } catch (error) {
        console.error('Dashboard data error:', error);
        setHasCrops(false);
        setCrops(demoCrops);
        setHistoricalData(demoHistoricalData);
        setEfficiencyData([
          { name: 'Wheat', efficiency: 15, trend: 'up' },
          { name: 'Corn', efficiency: 8, trend: 'up' },
          { name: 'Soybeans', efficiency: 5, trend: 'up' }
        ]);
        calculateForecast(demoHistoricalData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
 const calculateForecast = (historyData) => {
  if (!historyData || historyData.length < 2) return;

  const latest = historyData[historyData.length - 1];
  const previous = historyData[historyData.length - 2];

  // Get crop keys dynamically, ignoring 'season' and 'name'
  const cropKeys = Object.keys(latest).filter(key => key !== 'season' && key !== 'name');

  // Build forecast object
  const forecast = { name: 'Next (Forecast)' };
  cropKeys.forEach(crop => {
    const trend = latest[crop] - previous[crop];
    forecast[crop] = Math.round(latest[crop] + trend * 0.8);
  });

  // Include last 6 seasons + forecast
  const lastSix = historyData.slice(-6).map(item => {
    const itemCrops = {};
    cropKeys.forEach(crop => {
      itemCrops[crop] = item[crop] || 0;
    });
    return {
      name: item.season.split(' ')[0],
      ...itemCrops
    };
  });

  setForecastData([...lastSix, forecast]);
};



  const updateYield = async (id, value) => {
    try {
      await api.put(`/yields/${id}`, { quantity: parseFloat(value) });
      setCrops(crops.map(crop => 
        crop._id === id ? { ...crop, quantity: parseFloat(value) } : crop
      ));
    } catch (error) {
      console.error('Error updating yield:', error);
    }
  };

  // Calculate performance metrics
  const performanceMetrics = crops.map(crop => ({
    ...crop,
    progress: (crop.quantity / crop.targetYield) * 100,
    efficiency: crop.quantity > crop.targetYield 
      ? Math.round(((crop.quantity - crop.targetYield) / crop.targetYield) * 100)
      : 0
  }));

  // Data for pie chart
  const pieData = crops.map(crop => ({
    name: crop.cropName,
    value: crop.quantity
  }));

  // Pagination for crops
  const itemsPerPage = 2;
  const totalPages = Math.ceil(performanceMetrics.length / itemsPerPage);
  const paginatedCrops = performanceMetrics.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  // Custom tooltip for efficiency chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className={darkMode ? "text-green-400" : "text-green-600"}>
            Efficiency: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hasCrops && (
        <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-100'} border ${darkMode ? 'border-blue-700' : 'border-blue-300'}`}>
          <p className={darkMode ? 'text-blue-300' : 'text-blue-800'}>
            You're viewing demo data. Add your crops to see personalized analytics.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 shadow-md transition-transform duration-200 hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Crops</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{crops.length}</p>
            </div>
            <CropIcon className={`w-10 h-10 ${darkMode ? 'text-green-400' : 'text-green-600'} opacity-20`} />
          </div>
        </div>
        
        <div className={`rounded-xl p-6 shadow-md transition-transform duration-200 hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
        
        <div className={`rounded-xl p-6 shadow-md transition-transform duration-200 hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Performer</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {performanceMetrics.reduce((max, crop) => max.progress > crop.progress ? max : crop).cropName}
              </p>
            </div>
            <TrophyIcon className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'} opacity-20`} />
          </div>
        </div>
        
        <div className={`rounded-xl p-6 shadow-md transition-transform duration-200 hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
            {paginatedCrops.map(crop => (
              <div key={crop._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{crop.cropName}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    crop.progress >= 100 
                      ? darkMode 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-green-100 text-green-800' 
                      : darkMode 
                        ? 'bg-amber-900 text-amber-300' 
                        : 'bg-amber-100 text-amber-800'
                  }`}>
                    {crop.progress >= 100 ? 'Target Achieved' : 'In Progress'}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Current: {crop.quantity} {crop.unit || 'kg'}
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Target: {crop.targetYield} {crop.unit || 'kg'}
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
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={crop.quantity}
                    onChange={(e) => updateYield(crop._id, e.target.value)}
                    className={`w-24 px-2 py-1 rounded text-sm cursor-pointer ${darkMode ? 'bg-gray-600 text-white' : 'bg-white border border-gray-300'}`}
                    min="0"
                  />
                  <span className={`text-sm font-medium ${
                    crop.progress >= 100 
                      ? darkMode 
                        ? 'text-green-400' 
                        : 'text-green-600' 
                      : darkMode 
                        ? 'text-amber-400' 
                        : 'text-amber-600'
                  }`}>
                    {Math.round(crop.progress)}% of target
                  </span>
                </div>
              </div>
            ))}
            {/* Pagination controls */}
            <div className="flex justify-center items-center space-x-4 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-full ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} ${darkMode ? 'text-white' : 'text-gray-700'}`}
              >
                <FaChevronLeft />
              </button>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-full ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} ${darkMode ? 'text-white' : 'text-gray-700'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Yield Distribution */}
        <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            Yield Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
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
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  wrapperStyle={{
                    paddingTop: '10px'
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
          {hasCrops ? (
            // For real users - only show their crops
            crops.map((crop, index) => (
              <Area
                key={crop._id}
                type="monotone"
                dataKey={crop.cropName}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.4}
              />
            ))
          ) : (
            // For demo users - show all available crops
            forecastData && Object.keys(forecastData[0])
              .filter(key => key !== 'name' && key !== 'season')
              .map((crop, index) => (
                <Area
                  key={crop}
                  type="monotone"
                  dataKey={crop}
                  stackId="1"
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.4}
                />
              ))
          )}
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="efficiency">
                  {efficiencyData.map((entry, index) => (
                   <Cell 
  key={`cell-${index}`} 
  fill={entry.efficiency > 0 ? (darkMode ? '#10b981' : '#10b981') : (darkMode ? '#ef4444' : '#ef4444')} 
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