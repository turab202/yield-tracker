import React, { useState, useEffect } from 'react';
import { FaFilePdf as ExportIcon, FaEdit, FaTrash, FaPlus, FaSeedling as CropIcon } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';

const CropManagement = ({ darkMode }) => {
  const [crops, setCrops] = useState([]);
  const { triggerDashboardRefresh } = useAuth();
  const [newCrop, setNewCrop] = useState({
    name: '',
    currentYield: '',
    targetYield: '',
    unit: 'kg',
    season: 'Summer 2023',
    plantedDate: '',
    harvestDate: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch crops (yields) from backend on mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if environment variable is set
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('API base URL is not configured');
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/api/yields`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch crops: ${res.status}`);
      }

      const data = await res.json();

      const mapped = data.map(y => ({
        id: y._id,
        name: y.cropName,
        currentYield: y.quantity,
        targetYield: y.targetYield || 0,
        unit: y.unit || 'kg',
        season: y.season || 'Summer 2023',
        plantedDate: y.plantedDate || '',
        harvestDate: y.harvestDate || '',
        notes: y.notes || '',
      }));

      setCrops(mapped);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop({ ...newCrop, [name]: value });
  };

  const addCrop = async () => {
    if (!newCrop.name || !newCrop.currentYield) {
      alert('Please fill required fields: Crop Name and Current Yield.');
      return;
    }

    const token = localStorage.getItem('token');

    if (editingId) {
      try {
        setLoading(true);
        setError(null);
        
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!baseUrl) {
          throw new Error('API base URL is not configured');
        }

        const putBody = {
          cropName: newCrop.name,
          quantity: parseFloat(newCrop.currentYield),
          targetYield: newCrop.targetYield ? parseFloat(newCrop.targetYield) : 0,
          unit: newCrop.unit,
          season: newCrop.season,
          plantedDate: newCrop.plantedDate,
          harvestDate: newCrop.harvestDate,
          notes: newCrop.notes || '',
        };

        const res = await fetch(`${baseUrl}/api/yields/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(putBody),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to update crop');
        }

        const updated = await res.json();
        setCrops(crops.map(crop => 
          crop.id === editingId ? {
            ...crop,
            name: updated.cropName,
            currentYield: updated.quantity,
            targetYield: updated.targetYield || 0,
            unit: updated.unit || 'kg',
            season: updated.season || 'Summer 2023',
            plantedDate: updated.plantedDate || '',
            harvestDate: updated.harvestDate || '',
            notes: updated.notes || '',
          } : crop
        ));
        
        setEditingId(null);
        setNewCrop({
          name: '',
          currentYield: '',
          targetYield: '',
          unit: 'kg',
          season: 'Summer 2023',
          plantedDate: '',
          harvestDate: '',
          notes: '',
        });
        triggerDashboardRefresh();
      } catch (err) {
        console.error('Update error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Add new crop
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('API base URL is not configured');
      }

      const postBody = {
        cropName: newCrop.name,
        quantity: parseFloat(newCrop.currentYield),
        targetYield: newCrop.targetYield ? parseFloat(newCrop.targetYield) : 0,
        unit: newCrop.unit,
        season: newCrop.season,
        plantedDate: newCrop.plantedDate,
        harvestDate: newCrop.harvestDate,
        notes: newCrop.notes || '',
      };

      const res = await fetch(`${baseUrl}/api/yields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postBody),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add crop');
      }

      const created = await res.json();
      const newEntry = {
        id: created._id,
        name: created.cropName,
        currentYield: created.quantity,
        targetYield: created.targetYield || 0,
        unit: created.unit || 'kg',
        season: created.season || 'Summer 2023',
        plantedDate: created.plantedDate || '',
        harvestDate: created.harvestDate || '',
        notes: created.notes || '',
      };

      setCrops([...crops, newEntry]);
      triggerDashboardRefresh();
      setNewCrop({
        name: '',
        currentYield: '',
        targetYield: '',
        unit: 'kg',
        season: 'Summer 2023',
        plantedDate: '',
        harvestDate: '',
        notes: '',
      });
    } catch (err) {
      console.error('Add error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
        harvestDate: cropToEdit.harvestDate,
        notes: cropToEdit.notes || '',
      });
      setEditingId(id);
    }
  };

  const deleteCrop = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return;

    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      setError(null);

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('API base URL is not configured');
      }

      const res = await fetch(`${baseUrl}/api/yields/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete crop');
      }

      setCrops(crops.filter(crop => crop.id !== id));
      triggerDashboardRefresh();

      if (editingId === id) {
        setEditingId(null);
        setNewCrop({
          name: '',
          currentYield: '',
          targetYield: '',
          unit: 'kg',
          season: 'Summer 2023',
          plantedDate: '',
          harvestDate: '',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      `${Math.round((crop.currentYield / (crop.targetYield || 1)) * 100)}%`,
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

  const performanceMetrics = crops.map(crop => ({
    ...crop,
    progress: crop.targetYield > 0 ? (crop.currentYield / crop.targetYield) * 100 : 0
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

          {error && (
            <div className="mb-2 text-red-500 text-sm font-semibold">{error}</div>
          )}

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
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Unit Field */}
            <div>
              <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Unit
              </label>
              <select
                name="unit"
                value={newCrop.unit}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${
                  darkMode
                    ? 'bg-gray-700 text-gray-400 border-gray-600'
                    : 'bg-white border text-gray-500 border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="ton">Tons</option>
                <option value="bushel">Bushels</option>
                <option value="lb">Pounds (lb)</option>
              </select>
            </div>

            {/* Season Field */}
            <div>
              <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Season
              </label>
              <select
                name="season"
                value={newCrop.season}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${
                  darkMode
                    ? 'bg-gray-700 text-gray-400 border-gray-600'
                    : 'bg-white border text-gray-500 border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="Winter 2023">Winter 2026</option>
                <option value="Spring 2023">Spring 2026</option>
                <option value="Summer 2023">Summer 2026</option>
                <option value="Fall 2023">Fall 2026</option>
              </select>
            </div>

            {/* Notes Field */}
            <div>
              <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes
              </label>
              <textarea
                name="notes"
                value={newCrop.notes}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white border border-gray-300'
                }`}
                placeholder="Optional notes"
                rows={3}
                disabled={loading}
              />
            </div>

            <button
              onClick={addCrop}
              className={`w-full py-2 px-4 rounded-md transition duration-200 flex items-center justify-center ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 cursor-pointer'
              } text-white`}
              disabled={loading}
            >
              {loading ? (
                'Processing...'
              ) : editingId ? (
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
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Crop Inventory
            </h2>
            <button
              onClick={exportToPDF}
              className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center space-x-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Export to PDF"
              disabled={loading}
            >
              <ExportIcon className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading crop data...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded bg-red-100 border border-red-400 text-red-700 mb-4">
              <p>Error: {error}</p>
              <button 
                onClick={fetchCrops}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
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
                          <CropIcon className={`flex-shrink-0 h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {crop.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {crop.currentYield} {crop.unit}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {crop.targetYield} {crop.unit}
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
                          <span
                            className={`text-xs font-medium ${
                              crop.progress >= 100
                                ? darkMode
                                  ? 'text-green-400'
                                  : 'text-green-600'
                                : darkMode
                                ? 'text-amber-400'
                                : 'text-amber-600'
                            }`}
                          >
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
                            className={`p-2 rounded-md ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'}`}
                            title="Edit"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteCrop(crop.id)}
                            className={`p-2 rounded-md ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                            title="Delete"
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {crops.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className={`text-center py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        No crops found. Add your first crop using the form.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropManagement;