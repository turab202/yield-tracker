import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const History = ({ darkMode }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [cropNames, setCropNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSeasonFromDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month === 11 || month <= 1) return `Winter ${year}`;
    if (month >= 2 && month <= 4) return `Spring ${year}`;
    if (month >= 5 && month <= 7) return `Summer ${year}`;
    if (month >= 8 && month <= 10) return `Fall ${year}`;
    return `Unknown ${year}`;
  };

  useEffect(() => {
    const fetchYields = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if environment variable is set
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!baseUrl) {
          throw new Error('API base URL is not configured');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/api/yields`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Process data
        const cropsSet = new Set();
        const grouped = {};

        data.forEach(({ cropName, quantity, season }) => {
          cropsSet.add(cropName);
          if (!grouped[season]) grouped[season] = { season };
          grouped[season][cropName] = (grouped[season][cropName] || 0) + quantity;
        });

        setCropNames([...cropsSet].sort());

        const seasonOrder = { Winter: 0, Spring: 1, Summer: 2, Fall: 3 };
        const sortedData = Object.values(grouped).sort((a, b) => {
          const [seasonA, yearA] = a.season.split(' ');
          const [seasonB, yearB] = b.season.split(' ');
          if (yearA !== yearB) return +yearA - +yearB;
          return seasonOrder[seasonA] - seasonOrder[seasonB];
        });

        setHistoricalData(sortedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load historical data');
      } finally {
        setLoading(false);
      }
    };

    fetchYields();
  }, []);

  // Color palette for chart lines
  const lineColors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6', '#db2777', '#eab308'];

  return (
    <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          Historical Yield Data
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading data...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded bg-red-100 border border-red-400 text-red-700">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="h-96 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                <XAxis 
                  dataKey="season" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                  label={{
                    value: 'Yield (kg)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: darkMode ? '#9CA3AF' : '#6B7280' }
                  }}
                />
                <Tooltip
                  contentStyle={darkMode ? {
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#F3F4F6',
                  } : null}
                />
                <Legend />
                {cropNames.map((cropName, idx) => (
                  <Line
                    key={cropName}
                    type="monotone"
                    dataKey={cropName}
                    stroke={lineColors[idx % lineColors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Season
                  </th>
                  {cropNames.map((cropName) => (
                    <th
                      key={cropName}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    >
                      {cropName} (kg)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {historicalData.map((data, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {data.season}
                    </td>
                    {cropNames.map((cropName) => (
                      <td
                        key={cropName}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {data[cropName] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default History;