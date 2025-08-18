import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { FaFilePdf as ExportIcon } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Switch } from '@headlessui/react';
import api from '../utils/api'; // ✅ use axios instance

const Analytics = ({ darkMode }) => {
  const [crops, setCrops] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seasons, setSeasons] = useState([]);

  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedCropsForComparison, setSelectedCropsForComparison] = useState([]);
  const [selectedSeasonsForComparison, setSelectedSeasonsForComparison] = useState([]);
  const [chartType, setChartType] = useState('bar');

  // Fetch current crop yields and historical data on mount
  useEffect(() => {
    fetchCrops();
    fetchHistoricalData();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/yields'); // ✅ use axios
      const data = res.data;
      const mapped = data.map(item => ({
        id: item._id,
        name: item.cropName,
        currentYield: item.quantity,
        targetYield: item.targetYield || 0,
        unit: item.unit || 'kg',
        season: item.season || 'Unknown',
      }));
      setCrops(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataRes, seasonsRes] = await Promise.all([
        api.get('/yield-histories'), // ✅ use axios
        api.get('/yield-histories/seasons'),
      ]);

      const data = dataRes.data;
      const seasonsResult = seasonsRes.data;

      const transformedData = data.map(entry => ({
  season: entry.season,
  ...((entry.yields || []).reduce((acc, yieldEntry) => {
    acc[yieldEntry.cropName] = yieldEntry.quantity;
    return acc;
  }, {}))
}));

      let extractedSeasons = [];
      if (Array.isArray(seasonsResult)) {
        extractedSeasons = seasonsResult;
      } else if (seasonsResult?.seasons) {
        extractedSeasons = seasonsResult.seasons;
      } else if (seasonsResult?.data) {
        extractedSeasons = seasonsResult.data;
      }

      setHistoricalData(transformedData);
      setSeasons([...new Set(extractedSeasons.filter(s => s))]);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle crop selection for comparison
  const toggleComparison = (cropId) => {
    if (selectedCropsForComparison.includes(cropId)) {
      setSelectedCropsForComparison(selectedCropsForComparison.filter(id => id !== cropId));
    } else {
      setSelectedCropsForComparison([...selectedCropsForComparison, cropId]);
    }
  };

  // Toggle season selection for comparison
  const toggleSeasonComparison = (season) => {
    if (selectedSeasonsForComparison.includes(season)) {
      setSelectedSeasonsForComparison(selectedSeasonsForComparison.filter(s => s !== season));
    } else {
      setSelectedSeasonsForComparison([...selectedSeasonsForComparison, season]);
    }
  };

  // Calculate performance with safe zero division check
  const performanceMetrics = crops.map(crop => ({
    ...crop,
    progress: crop.targetYield > 0 ? (crop.currentYield / crop.targetYield) * 100 : 0,
  }));

  const cropColors = {
    Wheat: '#f59e0b',
    Corn: '#10b981',
    Soybeans: '#3b82f6',
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(darkMode ? '#34D399' : '#059669');
    doc.text('Yield Analytics Report', 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(darkMode ? '#D1D5DB' : '#374151');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    const tableColumn = ['Crop', 'Current Yield', 'Target Yield', 'Progress (%)', 'Season'];
    const tableRows = performanceMetrics.map(crop => [
      crop.name,
      `${crop.currentYield} ${crop.unit}`,
      `${crop.targetYield} ${crop.unit}`,
      crop.progress.toFixed(2),
      crop.season
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 10 },
      headStyles: { fillColor: darkMode ? '#065f46' : '#10b981' },
    });

    doc.save(`yield-analytics-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          Yield Analytics
        </h2>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              chartType === 'bar'
                ? darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
            title="Bar Chart"
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              chartType === 'line'
                ? darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
            title="Line Chart"
          >
            Line Chart
          </button>

          <button
            onClick={exportToPDF}
            className={`p-2 rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1`}
            title="Export report as PDF"
          >
            <ExportIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-500 mb-4">{error}</p>
      )}

      {/* Main Chart */}
      <div className="h-96 mb-8">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Bar dataKey="currentYield" fill={cropColors.Wheat} name="Current Yield" />
              <Bar dataKey="targetYield" fill={cropColors.Corn} name="Target Yield" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Line type="monotone" dataKey="currentYield" stroke={cropColors.Wheat} name="Current Yield" />
              <Line type="monotone" dataKey="targetYield" stroke={cropColors.Corn} name="Target Yield" />
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
             {seasons.map(season => (
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
            {/* Comparison Chart */}
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    selectedSeasonsForComparison.length > 0
                      ? historicalData
                          .filter(data => selectedSeasonsForComparison.includes(data.season))
                          .map(seasonData => {
                            const seasonEntry = { season: seasonData.season };
                            crops.forEach(crop => {
                              seasonEntry[crop.name] = seasonData[crop.name] || 0;
                            });
                            return seasonEntry;
                          })
                      : performanceMetrics.filter(crop => selectedCropsForComparison.includes(crop.id))
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
                  {selectedSeasonsForComparison.length > 0 ? (
                    crops.map(crop => (
                      <Bar
                        key={crop.id}
                        dataKey={crop.name}
                        fill={cropColors[crop.name] || '#8884d8'}
                        name={crop.name}
                      />
                    ))
                  ) : (
                    <>
                      <Bar dataKey="currentYield" fill="#4ade80" name="Current Yield" />
                      <Bar dataKey="targetYield" fill="#fbbf24" name="Target Yield" />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    selectedSeasonsForComparison.length > 0
                      ? historicalData
                          .filter(data => selectedSeasonsForComparison.includes(data.season))
                          .map(seasonData => {
                            const seasonEntry = { season: seasonData.season };
                            crops.forEach(crop => {
                              seasonEntry[crop.name] = seasonData[crop.name] || 0;
                            });
                            return seasonEntry;
                          })
                      : performanceMetrics.filter(crop => selectedCropsForComparison.includes(crop.id))
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
                  {selectedSeasonsForComparison.length > 0 ? (
                    crops.map(crop => (
                      <Line
                        key={crop.id}
                        type="monotone"
                        dataKey={crop.name}
                        stroke={cropColors[crop.name] || '#8884d8'}
                        name={crop.name}
                      />
                    ))
                  ) : (
                    <>
                      <Line type="monotone" dataKey="currentYield" stroke="#4ade80" name="Current Yield" />
                      <Line type="monotone" dataKey="targetYield" stroke="#fbbf24" name="Target Yield" />
                    </>
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
