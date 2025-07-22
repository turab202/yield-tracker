import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust if needed
import { Tab } from '@headlessui/react';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import History from './History';
import CropManagement from './CropManagement';
import { FaSeedling as CropIcon, FaCog as SettingsIcon, FaTemperatureHigh as TempIcon } from 'react-icons/fa';

const HarvestYieldTracker = () => {
  const { user, logout } = useAuth();  // Get user and logout function
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState('Main Farm Field A');
  const [weather] = useState({
    temperature: 24,
    humidity: 65
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <CropIcon className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h1 className="ml-2 text-xl font-bold">Yield Tracker</h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Dark Mode Toggle Switcher with Icons */}
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 rounded-full bg-gray-300 peer-checked:bg-gray-700 transition-colors duration-300 px-1 flex items-center">
                    {/* Toggle icon that slides */}
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md transform transition-transform duration-300
                        ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}
                    >
                      {darkMode ? (
                        // Light Mode Icon (Sun) — shown when in Dark Mode
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-yellow-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h1M3 12H2m16.24-6.24l.71.71M5.05 18.95l.71.71M18.95 18.95l-.71.71M5.05 5.05l-.71.71M12 7a5 5 0 100 10 5 5 0 000-10z"
                          />
                        </svg>
                      ) : (
                        // Dark Mode Icon (Moon) — shown when in Light Mode
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-800"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* User info + Logout */}
              {user && (
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200
                      ${darkMode
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'}`}
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Settings Button with Dropdown */}
              <div className="relative group">
                <button className={`p-2 cursor-pointer rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200 hover:bg-opacity-10'} transition-colors duration-200 focus:outline-none`}>
                  <SettingsIcon className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'} group-hover:rotate-45 transition-transform duration-300`} />
                </button>
                
                {/* Dropdown Panel */}
                <div className={`absolute right-0 mt-2 w-64 p-4 rounded-lg shadow-lg z-20 ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} transform scale-0 group-hover:scale-100 origin-top-right transition-transform duration-200 ease-in-out`}>
                  {/* Temperature Display */}
                  <div className={`flex items-center justify-between mb-4 p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                    <div className="flex items-center space-x-2">
                      <TempIcon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Temperature</p>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{weather.temperature}°C</p>
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Humidity</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{weather.humidity}%</p>
                    </div>
                  </div>

                  {/* Location Selector */}
                  <div className="mb-4 relative">
                    <label
                      className={`block text-sm font-semibold mb-1 ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      Location:
                    </label>

                    {/* Wrapper for custom dropdown */}
                    <div className="relative">
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`appearance-none w-full px-3 py-2 rounded border cursor-pointer ${
                          darkMode
                            ? 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        } focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
                      >
                        <option>Hawassa field</option>
                        <option>Semera field</option>
                        <option>Bahirdar field</option>
                      </select>

                      {/* Custom SVG Arrow Icon */}
                      <div
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {/* Down Arrow SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs inside Tab.Group */}
        <div className="mb-6">
          <Tab.Group>
            <Tab.List className={`flex space-x-1 rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              {/* Dashboard Tab */}
              <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm leading-5 cursor-pointer font-semibold rounded-lg transition-all duration-200 focus:outline-none ${
                      selected
                        ? darkMode
                          ? 'bg-green-600 text-white shadow'
                          : 'bg-white text-green-700 shadow'
                        : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-green-700'
                    }`
                  }
                >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </div>
              </Tab>

              {/* Analytics Tab */}
              <Tab className={({ selected }) =>
                `w-full py-2.5 text-sm leading-5 cursor-pointer font-semibold rounded-lg transition-all duration-200 ${
                  selected
                    ? darkMode
                      ? 'bg-green-600 text-white shadow'
                      : 'bg-white text-green-700 shadow'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-green-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Analytics
                </div>
              </Tab>

              {/* History Tab */}
              <Tab className={({ selected }) =>
                `w-full py-2.5 text-sm leading-5 cursor-pointer font-semibold rounded-lg transition-all duration-200 ${
                  selected
                    ? darkMode
                      ? 'bg-green-600 text-white shadow'
                      : 'bg-white text-green-700 shadow'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-green-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  History
                </div>
              </Tab>

              {/* Management Tab */}
              <Tab className={({ selected }) =>
                `w-full py-2.5 text-sm leading-5 cursor-pointer font-semibold rounded-lg transition-all duration-200 ${
                  selected
                    ? darkMode
                      ? 'bg-green-600 text-white shadow'
                      : 'bg-white text-green-700 shadow'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-green-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                  </svg>
                  Management
                </div>
              </Tab>
            </Tab.List>

            {/* Tab Panels */}
            <Tab.Panels className="mt-6">
              <Tab.Panel>
                <Dashboard darkMode={darkMode} />
              </Tab.Panel>
              <Tab.Panel>
                <Analytics darkMode={darkMode} />
              </Tab.Panel>
              <Tab.Panel>
                <History darkMode={darkMode} />
              </Tab.Panel>
              <Tab.Panel>
                <CropManagement darkMode={darkMode} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
    </div>
  );
};

export default HarvestYieldTracker;
