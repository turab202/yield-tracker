import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaChartLine as AnalyticsIcon, FaExchangeAlt as CompareIcon, FaFilePdf as ExportIcon } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Switch } from '@headlessui/react';

const Analytics = ({ darkMode }) => {
  const [crops] = useState([
    { id: 1, name: 'Wheat', currentYield: 1200, targetYield: 1500, unit: 'kg', season: 'Summer 2023' },
    { id: 2, name: 'Corn', currentYield: 850, targetYield: 1000, unit: 'kg', season: 'Summer 2023' },
    { id: 3, name: 'Soybeans', currentYield: 600, targetYield: 800, unit: 'kg', season: 'Summer 2023' },
  ]);
  
  const [historicalData] = useState([
    { season: 'Winter 2022', Wheat: 1100, Corn: 800, Soybeans: 550 },
    { season: 'Spring 2022', Wheat: 950, Corn: 700, Soybeans: 500 },
    { season: 'Summer 2022', Wheat: 1150, Corn: 820, Soybeans: 580 },
    { season: 'Fall 2022', Wheat: 1050, Corn: 780, Soybeans: 520 },
    { season: 'Winter 2023', Wheat: 1250, Corn: 880, Soybeans: 620 },
    { season: 'Spring 2023', Wheat: 1350, Corn: 920, Soybeans: 680 },
  ]);
  
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedCropsForComparison, setSelectedCropsForComparison] = useState([]);
  const [selectedSeasonsForComparison, setSelectedSeasonsForComparison] = useState([]);
  const [chartType, setChartType] = useState('bar');

  const toggleComparison = (cropId) => {
    if (selectedCropsForComparison.includes(cropId)) {
      setSelectedCropsForComparison(selectedCropsForComparison.filter(id => id !== cropId));
    } else {
      setSelectedCropsForComparison([...selectedCropsForComparison, cropId]);
    }
  };

  const toggleSeasonComparison = (season) => {
    if (selectedSeasonsForComparison.includes(season)) {
      setSelectedSeasonsForComparison(selectedSeasonsForComparison.filter(s => s !== season));
    } else {
      setSelectedSeasonsForComparison([...selectedSeasonsForComparison, season]);
    }
  };

  // Calculate performance metrics
  const performanceMetrics = crops.map(crop => ({
    ...crop,
    progress: (crop.currentYield / crop.targetYield) * 100
  }));

  // Prepare data for comparison charts
  const comparisonData = historicalData.filter(data => 
    selectedSeasonsForComparison.includes(data.season)
  );

  return (
    <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          Yield Analytics
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              chartType === 'bar' 
                ? darkMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              chartType === 'line' 
                ? darkMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            Line Chart
          </button>
        </div>
      </div>

      <div className="h-96 mb-8">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              <Legend />
              <Bar dataKey="currentYield" fill="#4ade80" name="Current Yield" />
              <Bar dataKey="targetYield" fill="#fbbf24" name="Target Yield" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              <Legend />
              <Line type="monotone" dataKey="currentYield" stroke="#4ade80" name="Current Yield" />
              <Line type="monotone" dataKey="targetYield" stroke="#fbbf24" name="Target Yield" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Comparison Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Data Comparison
          </h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comparison Mode</span>
            <Switch
              checked={comparisonMode}
              onChange={setComparisonMode}
              className={`${comparisonMode ? 'bg-blue-600' : 'bg-gray-200'} relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Comparison mode</span>
              <span
                className={`${comparisonMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </label>
        </div>

        {comparisonMode && (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-6`}>
            <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Crops to Compare
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {crops.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => toggleComparison(crop.id)}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    selectedCropsForComparison.includes(crop.id)
                      ? darkMode
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700'
                      : darkMode
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {crop.name}
                </button>
              ))}
            </div>

            <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Seasons to Compare
            </h4>
            <div className="flex flex-wrap gap-2">
              {[...new Set(historicalData.map(d => d.season))].map(season => (
                <button
                  key={season}
                  onClick={() => toggleSeasonComparison(season)}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    selectedSeasonsForComparison.includes(season)
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : darkMode
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        )}

        {comparisonMode && (selectedCropsForComparison.length > 0 || selectedSeasonsForComparison.length > 0) && (
          <div className="h-96 mt-6">
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    selectedSeasonsForComparison.length > 0 
                      ? comparisonData 
                      : crops.filter(crop => selectedCropsForComparison.includes(crop.id))
                  }
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                  <XAxis 
                    dataKey={selectedSeasonsForComparison.length > 0 ? 'season' : 'name'} 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={darkMode ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    } : null}
                  />
                  <Legend />
                  {selectedCropsForComparison.length > 0 && selectedSeasonsForComparison.length === 0 ? (
                    <>
                      <Bar dataKey="currentYield" fill="#4ade80" name="Current Yield" />
                      <Bar dataKey="targetYield" fill="#fbbf24" name="Target Yield" />
                    </>
                  ) : (
                    selectedCropsForComparison.length > 0 
                      ? crops
                          .filter(crop => selectedCropsForComparison.includes(crop.id))
                          .map(crop => (
                            <Bar 
                              key={crop.id} 
                              dataKey={crop.name} 
                              fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
                            />
                          ))
                      : (
                        <>
                          <Bar dataKey="Wheat" fill="#f59e0b" />
                          <Bar dataKey="Corn" fill="#10b981" />
                          <Bar dataKey="Soybeans" fill="#3b82f6" />
                        </>
                      )
                  )}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    selectedSeasonsForComparison.length > 0 
                      ? comparisonData 
                      : crops.filter(crop => selectedCropsForComparison.includes(crop.id))
                  }
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                  <XAxis 
                    dataKey={selectedSeasonsForComparison.length > 0 ? 'season' : 'name'} 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={darkMode ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    } : null}
                  />
                  <Legend />
                  {selectedCropsForComparison.length > 0 && selectedSeasonsForComparison.length === 0 ? (
                    <>
                      <Line type="monotone" dataKey="currentYield" stroke="#4ade80" name="Current Yield" />
                      <Line type="monotone" dataKey="targetYield" stroke="#fbbf24" name="Target Yield" />
                    </>
                  ) : (
                    selectedCropsForComparison.length > 0 
                      ? crops
                          .filter(crop => selectedCropsForComparison.includes(crop.id))
                          .map(crop => (
                            <Line 
                              key={crop.id} 
                              type="monotone" 
                              dataKey={crop.name} 
                              stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
                            />
                          ))
                      : (
                        <>
                          <Line type="monotone" dataKey="Wheat" stroke="#f59e0b" />
                          <Line type="monotone" dataKey="Corn" stroke="#10b981" />
                          <Line type="monotone" dataKey="Soybeans" stroke="#3b82f6" />
                        </>
                      )
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;