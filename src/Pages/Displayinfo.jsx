import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Displayinfo.css'; // Ensure this path matches your project structure

const DisplayInfo = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/item/get');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
      setLoading(false);
    }
  };

  const updateItem = async (id, updatedData) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value); // File upload
        } else if (key === 'arrayofimage' && Array.isArray(value)) {
          // For arrayofimage, only append new File objects; existing URLs are handled separately
          const existingUrls = value.filter(item => typeof item === 'string');
          const newFiles = value.filter(item => item instanceof File);
          if (newFiles.length > 0) {
            newFiles.forEach(file => formData.append('arrayofimage', file));
          }
          if (existingUrls.length > 0) {
            formData.append('arrayofimage', JSON.stringify(existingUrls));
          }
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Stringify arrays
        } else if (key !== '_id' && key !== '__v' && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/item/update/${id}`, {
        method: 'PUT',
        body: formData, // No Content-Type header; browser sets multipart/form-data automatically
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      fetchItems();
      setSelectedItem(null);
    } catch (err) {
      setError(err.message || 'Failed to update item');
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/item/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    }
  };

  const handleUpdateChange = (e, field, index = null) => {
    const value = e.target.value;
    setSelectedItem(prev => {
      if (index !== null && Array.isArray(prev[field])) {
        const updatedArray = [...prev[field]];
        updatedArray[index] = value;
        return { ...prev, [field]: updatedArray };
      }
      return { ...prev, [field]: value };
    });
  };

  const addArrayItem = (field) => {
    setSelectedItem(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ''], // Add empty string or placeholder
    }));
  };

  const removeArrayItem = (field, index) => {
    setSelectedItem(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e, field, index = null) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedItem(prev => {
        if (index !== null && Array.isArray(prev[field])) {
          const updatedArray = [...prev[field]];
          updatedArray[index] = file; // Store File object
          return { ...prev, [field]: updatedArray };
        }
        return { ...prev, [field]: file }; // Single image
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-5 text-center fw-bold text-gradient">Dynamic Components</h1>

      {/* Cards Grid */}
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
        {items.map((item) => (
          <div key={item._id} className="col">
            <div className="card square-card shadow-sm border-0 hover-card">
              <div className="card-body d-flex flex-column justify-content-between p-3">
                <h6 className="card-title mb-3 text-center text-truncate fw-semibold">{item.heading}</h6>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary px-3 py-1"
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger px-3 py-1"
                    onClick={(e) => { e.stopPropagation(); deleteItem(item._id); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Editing */}
      {selectedItem && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg animate-modal">
              <div className="modal-header bg-gradient-primary text-white">
                <h5 className="modal-title fw-semibold">Edit: {selectedItem.heading}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedItem(null)}
                ></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <form onKeyPress={handleKeyPress}>
                  <div className="row g-4">
                    {Object.entries(selectedItem).map(([key, value]) => (
                      key !== '_id' && key !== '__v' && (
                        <div key={key} className="col-md-6">
                          <label className="form-label fw-semibold text-muted small">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </label>
                          {Array.isArray(value) && key === 'arrayofimage' ? (
                            <div>
                              {value.map((item, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                  {typeof item === 'string' ? (
                                    <img
                                      src={item}
                                      alt={`Image ${index}`}
                                      className="img-thumbnail me-2"
                                      style={{ maxWidth: '50px', maxHeight: '50px' }}
                                    />
                                  ) : (
                                    <span className="me-2">New File: {item.name}</span>
                                  )}
                                  <input
                                    type="file"
                                    className="form-control modern-input me-2"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, key, index)}
                                  />
                                  {typeof item === 'string' && (
                                    <input
                                      type="text"
                                      className="form-control modern-input me-2"
                                      value={item}
                                      onChange={(e) => handleUpdateChange(e, key, index)}
                                      placeholder="Or enter URL"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeArrayItem(key, index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm mt-2"
                                onClick={() => addArrayItem(key)}
                              >
                                Add Image
                              </button>
                            </div>
                          ) : Array.isArray(value) ? (
                            <div>
                              {value.map((item, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                  <input
                                    type="text"
                                    className="form-control modern-input me-2"
                                    value={item}
                                    onChange={(e) => handleUpdateChange(e, key, index)}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeArrayItem(key, index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm mt-2"
                                onClick={() => addArrayItem(key)}
                              >
                                Add Point
                              </button>
                            </div>
                          ) : key === 'image' ? (
                            <div>
                              {typeof value === 'string' && value && (
                                <img
                                  src={value}
                                  alt="Preview"
                                  className="img-thumbnail mb-2"
                                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                                />
                              )}
                              {value instanceof File && (
                                <span className="mb-2 d-block">New File: {value.name}</span>
                              )}
                              <input
                                type="file"
                                className="form-control modern-input"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, key)}
                              />
                              {typeof value === 'string' && (
                                <input
                                  type="text"
                                  className="form-control modern-input mt-2"
                                  value={value || ''}
                                  onChange={(e) => handleUpdateChange(e, key)}
                                  placeholder="Or enter image URL"
                                />
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              className="form-control modern-input"
                              value={value || ''}
                              onChange={(e) => handleUpdateChange(e, key)}
                            />
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </form>
              </div>
              <div className="modal-footer bg-light">
                <button className="btn btn-outline-secondary" onClick={() => setSelectedItem(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary shadow-sm"
                  onClick={() => updateItem(selectedItem._id, selectedItem)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayInfo;