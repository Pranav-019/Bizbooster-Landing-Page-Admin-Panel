import React, { useState, useEffect } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';

const Count = () => {
  const { currentColor, currentMode } = useStateContext();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBox, setCurrentBox] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newBox, setNewBox] = useState({
    boxNo: '',
    count: '',
    title: '',
    description: ''
  });

  // Fetch all boxes
  const fetchBoxes = async () => {
    try {
      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/box/get');
      if (!response.ok) {
        throw new Error('Failed to fetch boxes');
      }
      const data = await response.json();
      setBoxes(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  // Add new box
  const handleAdd = async () => {
    try {
      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/box/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBox),
      });

      if (!response.ok) {
        throw new Error('Failed to add box');
      }

      await fetchBoxes();
      setIsAdding(false);
      setNewBox({ boxNo: '', count: '', title: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Update box
  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/box/update/${currentBox._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentBox),
      });

      if (!response.ok) {
        throw new Error('Failed to update box');
      }

      await fetchBoxes();
      setIsEditing(false);
      setCurrentBox(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete box
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/box/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete box');
      }

      await fetchBoxes();
    } catch (err) {
      setError(err.message);
    }
  };

  // Partial update (replace)
  const handleReplace = async (id, updates) => {
    try {
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/box/replace/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update box');
      }

      await fetchBoxes();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${currentMode === 'Dark' ? 'dark:bg-main-dark-bg' : 'bg-main-bg'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: currentColor }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${currentMode === 'Dark' ? 'dark:bg-main-dark-bg' : 'bg-main-bg'}`}>
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 ${currentMode === 'Dark' ? 'dark:bg-secondary-dark-bg' : 'bg-white'} rounded-3xl`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: currentMode === 'Dark' ? 'white' : 'black' }}>
          Box Count Management
        </h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ backgroundColor: currentColor, color: 'white' }}
        >
          <FiPlus /> Add New Box
        </button>
      </div>

      {/* Add New Box Form */}
      {isAdding && (
        <div className={`mb-6 p-4 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Box Number
              </label>
              <input
                type="text"
                value={newBox.boxNo}
                onChange={(e) => setNewBox({ ...newBox, boxNo: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Count
              </label>
              <input
                type="text"
                value={newBox.count}
                onChange={(e) => setNewBox({ ...newBox, count: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Title
              </label>
              <input
                type="text"
                value={newBox.title}
                onChange={(e) => setNewBox({ ...newBox, title: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Description
              </label>
              <input
                type="text"
                value={newBox.description}
                onChange={(e) => setNewBox({ ...newBox, description: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              <FiX /> Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: currentColor, color: 'white' }}
            >
              <FiCheck /> Add Box
            </button>
          </div>
        </div>
      )}

      {/* Edit Box Form */}
      {isEditing && currentBox && (
        <div className={`mb-6 p-4 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Box Number
              </label>
              <input
                type="text"
                value={currentBox.boxNo}
                onChange={(e) => setCurrentBox({ ...currentBox, boxNo: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Count
              </label>
              <input
                type="text"
                value={currentBox.count}
                onChange={(e) => setCurrentBox({ ...currentBox, count: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Title
              </label>
              <input
                type="text"
                value={currentBox.title}
                onChange={(e) => setCurrentBox({ ...currentBox, title: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Description
              </label>
              <input
                type="text"
                value={currentBox.description}
                onChange={(e) => setCurrentBox({ ...currentBox, description: e.target.value })}
                className="w-full p-2 border rounded"
                style={{ backgroundColor: currentMode === 'Dark' ? 'rgb(31, 41, 55)' : 'white' }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              <FiX /> Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: currentColor, color: 'white' }}
            >
              <FiCheck /> Update Box
            </button>
          </div>
        </div>
      )}

      {/* Boxes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <div
            key={box._id}
            className={`p-6 rounded-lg shadow-md ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'}`}
            style={{ borderTop: `4px solid ${currentColor}` }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold" style={{ color: currentMode === 'Dark' ? 'white' : 'black' }}>
                {box.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentBox(box);
                    setIsEditing(true);
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  style={{ color: currentColor }}
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(box._id)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold" style={{ color: currentColor }}>
                {box.count}
              </span>
            </div>
            <p className="text-sm" style={{ color: currentMode === 'Dark' ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' }}>
              {box.description}
            </p>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: currentMode === 'Dark' ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)' }}>
              <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: `${currentColor}20`, color: currentColor }}>
                Box #{box.boxNo}
              </span>
            </div>
          </div>
        ))}
      </div>

      {boxes.length === 0 && (
        <div className="text-center py-10">
          <p style={{ color: currentMode === 'Dark' ? 'white' : 'black' }}>No boxes found. Add a new box to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Count;