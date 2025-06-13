import React, { useState } from 'react';
import { FaFilePdf as ExportIcon, FaEdit, FaTrash, FaPlus, FaSeedling as CropIcon } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CropManagement = ({ darkMode }) => {
  const [crops, setCrops] = useState([
    { id: 1, name: 'Wheat', currentYield: 1200, targetYield: 1500, unit: 'kg', season: 'Summer 2025', plantedDate: '2024-03-15', harvestDate: '2023-07-20' },
    { id: 2, name: 'Corn', currentYield: 850, targetYield: 1000, unit: 'kg', season: 'Summer 2025', plantedDate: '2024-04-01', harvestDate: '2023-08-15' },
    { id: 3, name: 'Soybeans', currentYield: 600, targetYield: 800, unit: 'kg', season: 'Summer 2025', plantedDate: '2024-04-10', harvestDate: '2023-09-05' },
  ]);
  
  const [newCrop, setNewCrop] = useState({
    name: '',
    currentYield: '',
    targetYield: '',
    unit: 'kg',
    season: 'Summer 2024',
    plantedDate: '',
    harvestDate: ''
  });

  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop({ ...newCrop, [name]: value });
  };

  const addCrop = () => {
    if (newCrop.name && newCrop.currentYield && newCrop.targetYield) {
      if (editingId) {
        // Update existing crop
        setCrops(crops.map(crop => 
          crop.id === editingId ? { 
            ...crop,
            name: newCrop.name,
            currentYield: parseFloat(newCrop.currentYield),
            targetYield: parseFloat(newCrop.targetYield),
            unit: newCrop.unit,
            season: newCrop.season,
            plantedDate: newCrop.plantedDate,
            harvestDate: newCrop.harvestDate
          } : crop
        ));
        setEditingId(null);
      } else {
        // Add new crop
        const crop = {
          id: crops.length > 0 ? Math.max(...crops.map(c => c.id)) + 1 : 1,
          name: newCrop.name,
          currentYield: parseFloat(newCrop.currentYield),
          targetYield: parseFloat(newCrop.targetYield),
          unit: newCrop.unit,
          season: newCrop.season,
          plantedDate: newCrop.plantedDate,
          harvestDate: newCrop.harvestDate
        };
        setCrops([...crops, crop]);
      }
      
      // Reset form
      setNewCrop({ 
        name: '', 
        currentYield: '', 
        targetYield: '', 
        unit: 'kg', 
        season: 'Summer 2023',
        plantedDate: '',
        harvestDate: ''
      });
    }
  };

  const editCrop = (id) => {
    const cropToEdit = crops.find(crop => crop.id === id);
    if (cropToEdit) {
      setNewCrop({
        name: cropToEdit.name,
        currentYield: cropToEdit.currentYield,
        targetYield: cropToEdit.targetYield,
        unit: cropToEdit.unit,
        season: cropToEdit.season,
        plantedDate: cropToEdit.plantedDate,
        harvestDate: cropToEdit.harvestDate
      });
      setEditingId(id);
    }
  };

  const deleteCrop = (id) => {
    setCrops(crops.filter(crop => crop.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewCrop({ 
        name: '', 
        currentYield: '', 
        targetYield: '', 
        unit: 'kg', 
        season: 'Summer 2023',
        plantedDate: '',
        harvestDate: ''
      });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 167, 69);
    doc.text('Crop Management Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(40, 167, 69);
    doc.text('Crop Inventory', 14, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    
    const tableData = crops.map(crop => [
      crop.name,
      `${crop.currentYield} ${crop.unit}`,
      `${crop.targetYield} ${crop.unit}`,
      `${Math.round((crop.currentYield / crop.targetYield) * 100)}%`,
      crop.season,
      crop.plantedDate || 'N/A',
      crop.harvestDate || 'N/A'
    ]);
    
    doc.autoTable({
      startY: 50,
      head: [['Crop', 'Current Yield', 'Target Yield', 'Progress', 'Season', 'Planted Date', 'Harvest Date']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: 255
      }
    });
    
    doc.save(`crop-management-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Calculate performance metrics
  const performanceMetrics = crops.map(crop => ({
    ...crop,
    progress: (crop.currentYield / crop.targetYield) * 100
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar - Input and Controls */}
      <div className="lg:col-span-1 space-y-6">
        {/* Add New Crop */}
        <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {editingId ? 'Edit Crop' : 'Add New Crop'}
          </h2>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Crop Name
              </label>
              <input
                type="text"
                name="name"
                value={newCrop.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white border border-gray-300'
                }`}
                placeholder="e.g., Wheat, Corn"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Yield
                </label>
                <input
                  type="number"
                  name="currentYield"
                  value={newCrop.currentYield}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white border border-gray-300'
                  }`}
                  placeholder="Quantity"
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Target Yield
                </label>
                <input
                  type="number"
                  name="targetYield"
                  value={newCrop.targetYield}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white border border-gray-300'
                  }`}
                  placeholder="Target"
                />
              </div>
            </div>
            
            {/* Unit Field */}
            <div>
            <label
                className={`block text-sm font-semibold mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
                Unit
            </label>
            <div className="relative">
                <select
                name="unit"
                value={newCrop.unit}
                onChange={handleInputChange}
                className={`appearance-none w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${
                    darkMode
                    ? 'bg-gray-700 text-gray-400 border-gray-600'
                    : 'bg-white border text-gray-500 border-gray-300'
                }`}
                >
                <option value="kg">Kilograms (kg)</option>
                <option value="ton">Tons</option>
                <option value="bushel">Bushels</option>
                <option value="lb">Pounds (lb)</option>
                </select>

                {/* Custom SVG Arrow Icon */}
                <div
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                >
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

            {/* Season Field */}
            <div>
            <label
                className={`block text-sm font-semibold mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
                Season
            </label>
            <div className="relative">
                <select
                name="season"
                value={newCrop.season}
                onChange={handleInputChange}
                className={`appearance-none w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${
                    darkMode
                    ? 'bg-gray-700 text-gray-400 border-gray-600'
                    : 'bg-white border text-gray-500 border-gray-300'
                }`}
                >
                <option value="Winter 2023">Winter 2026</option>
                <option value="Spring 2023">Spring 2026</option>
                <option value="Summer 2023">Summer 2026</option>
                <option value="Fall 2023">Fall 2026</option>
                </select>

                {/* Custom SVG Arrow Icon */}
                <div
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                >
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
            
            <button
              onClick={addCrop}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center cursor-pointer"
            >
              {editingId ? (
                <>
                  <FaEdit className="w-5 h-5 mr-2" />
                  Update Crop
                </>
              ) : (
                <>
                  <FaPlus className="w-5 h-5 mr-2" />
                  Add Crop
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            Crop Inventory
          </h2>
          
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Crop
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Current Yield
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Target Yield
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Progress
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Season
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {performanceMetrics.map((crop, index) => (
                  <tr key={crop.id} className={index % 2 === 0 ? darkMode ? 'bg-gray-800' : 'bg-white' : darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {crop.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {crop.currentYield}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {crop.targetYield}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 mr-2">
                          <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div
                              className={`h-2 rounded-full ${
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
                        <span className={`text-xs font-medium ${
                          crop.progress >= 100 
                            ? darkMode 
                              ? 'text-green-400' 
                              : 'text-green-600' 
                            : darkMode 
                              ? 'text-amber-400' 
                              : 'text-amber-600'
                        }`}>
                          {Math.round(crop.progress)}%
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {crop.season}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editCrop(crop.id)}
                          className={`p-2 rounded-md cursor-pointer ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'}`}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteCrop(crop.id)}
                          className={`p-2 rounded-md cursor-pointer ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropManagement;