import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaFilePdf as ExportIcon } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const History = ({ darkMode }) => {
  const [historicalData] = useState([
    { season: 'Winter 2022', Wheat: 1100, Corn: 800, Soybeans: 550 },
    { season: 'Spring 2022', Wheat: 950, Corn: 700, Soybeans: 500 },
    { season: 'Summer 2022', Wheat: 1150, Corn: 820, Soybeans: 580 },
    { season: 'Fall 2022', Wheat: 1050, Corn: 780, Soybeans: 520 },
    { season: 'Winter 2023', Wheat: 1250, Corn: 880, Soybeans: 620 },
    { season: 'Spring 2023', Wheat: 1350, Corn: 920, Soybeans: 680 },
  ]);

  return (
    <div className={`rounded-xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          Historical Yield Data
        </h2>
      </div>
      
      <div className="h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historicalData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
            <XAxis dataKey="season" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
            <Tooltip 
              contentStyle={darkMode ? { 
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                color: '#F3F4F6'
              } : null}
            />
            <Legend />
            <Line type="monotone" dataKey="Wheat" stroke="#f59e0b" />
            <Line type="monotone" dataKey="Corn" stroke="#10b981" />
            <Line type="monotone" dataKey="Soybeans" stroke="#3b82f6" />
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
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Wheat (kg)
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Corn (kg)
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Soybeans (kg)
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            {historicalData.map((data, index) => (
              <tr key={index} className={index % 2 === 0 ? darkMode ? 'bg-gray-800' : 'bg-white' : darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {data.season}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {data.Wheat}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {data.Corn}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {data.Soybeans}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;