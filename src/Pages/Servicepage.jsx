import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Displayinfo.css';

const Servicepage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/page/get');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
      setLoading(false);
    }
  };

  const createNewService = () => {
    setIsCreating(true);
    setSelectedService({
      servicetitle: '',
      serviceImage: '',
      titleDescArray: [],
      categoryname: []
    });
  };

  const addService = async (newServiceData) => {
    if (!newServiceData) return;
    
    try {
      const formData = new FormData();
      
      formData.append('servicetitle', newServiceData.servicetitle || '');
      
      if (newServiceData.serviceImage instanceof File) {
        formData.append('serviceImage', newServiceData.serviceImage);
      } else if (typeof newServiceData.serviceImage === 'string') {
        formData.append('serviceImage', newServiceData.serviceImage);
      }

      formData.append('titleDescArray', JSON.stringify(newServiceData.titleDescArray || []));
      formData.append('categoryname', JSON.stringify(newServiceData.categoryname || []));
      
      if (Array.isArray(newServiceData.categoryname)) {
        newServiceData.categoryname.forEach((item) => {
          if (item?.image instanceof File) {
            formData.append('categoryImages', item.image);
          }
        });
      }

      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/page/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      await fetchServices();
      setSelectedService(null);
      setIsCreating(false);
    } catch (err) {
      setError(err.message || 'Failed to create service');
      console.error('Create error:', err);
    }
  };

  const updateService = async (id, updatedData) => {
    if (!id || !updatedData) return;
    
    try {
      const formData = new FormData();
      
      formData.append('servicetitle', updatedData.servicetitle || '');
      
      if (updatedData.serviceImage instanceof File) {
        formData.append('serviceImage', updatedData.serviceImage);
      } else if (typeof updatedData.serviceImage === 'string') {
        formData.append('serviceImage', updatedData.serviceImage);
      }

      formData.append('titleDescArray', JSON.stringify(updatedData.titleDescArray || []));
      formData.append('categoryname', JSON.stringify(updatedData.categoryname || []));
      
      if (Array.isArray(updatedData.categoryname)) {
        updatedData.categoryname.forEach((item) => {
          if (item?.image instanceof File) {
            formData.append('categoryImages', item.image);
          }
        });
      }

      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/page/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      await fetchServices();
      setSelectedService(null);
      setIsCreating(false);
    } catch (err) {
      setError(err.message || 'Failed to update service');
      console.error('Update error:', err);
    }
  };

  const deleteService = async (id) => {
    if (!id) return;
    
    try {
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/page/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      await fetchServices();
    } catch (err) {
      setError(err.message || 'Failed to delete service');
    }
  };

  const handleUpdateChange = (e, field, index = null, subField = null) => {
    const value = e.target.value;
    setSelectedService(prev => {
      if (!prev) return null;
      
      if (index !== null && Array.isArray(prev[field])) {
        const updatedArray = [...prev[field]];
        if (subField) {
          updatedArray[index] = { ...updatedArray[index], [subField]: value };
        } else {
          updatedArray[index] = value;
        }
        return { ...prev, [field]: updatedArray };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleImageUpload = (e, field, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedService(prev => {
      if (!prev) return null;
      
      if (index !== null && Array.isArray(prev[field])) {
        const updatedArray = [...prev[field]];
        updatedArray[index] = { 
          ...updatedArray[index], 
          image: file,
          imagePreview: URL.createObjectURL(file)
        };
        return { ...prev, [field]: updatedArray };
      }
      return { 
        ...prev, 
        [field]: file,
        imagePreview: URL.createObjectURL(file)
      };
    });
  };

  const addArrayItem = (field) => {
    setSelectedService(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [field]: [
          ...(prev[field] || []), 
          field === 'titleDescArray' 
            ? { title: '', description: '' } 
            : { image: '', title: '', description: '' }
        ],
      };
    });
  };

  const removeArrayItem = (field, index) => {
    setSelectedService(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [field]: (prev[field] || []).filter((_, i) => i !== index),
      };
    });
  };

  const handleSave = () => {
    if (!selectedService) return;
    
    if (isCreating) {
      addService(selectedService);
    } else if (selectedService._id) {
      updateService(selectedService._id, selectedService);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-5 text-center fw-bold text-gradient">Services Dashboard</h1>

      <div className="d-flex justify-content-end mb-4">
        <button 
          className="btn btn-primary shadow-sm"
          onClick={createNewService}
        >
          Create New Service
        </button>
      </div>

      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
        {services.map((service) => (
          <div key={service?._id} className="col">
            <div className="card square-card shadow-sm border-0 hover-card">
              <div className="card-body d-flex flex-column justify-content-between p-3">
                <h6 className="card-title mb-3 text-center text-truncate fw-semibold">
                  {service?.servicetitle || 'Untitled Service'}
                </h6>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary px-3 py-1"
                    onClick={() => {
                      if (service) {
                        setSelectedService(service);
                        setIsCreating(false);
                      }
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger px-3 py-1"
                    onClick={() => service?._id && deleteService(service._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(selectedService || isCreating) && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg animate-modal">
              <div className="modal-header bg-gradient-primary text-white">
                <h5 className="modal-title fw-semibold">
                  {isCreating ? 'Create New Service' : `Edit: ${selectedService?.servicetitle || 'Untitled Service'}`}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setSelectedService(null);
                    setIsCreating(false);
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <form>
                  <div className="row g-4">
                    <div className="col-md-12">
                      <label className="form-label fw-semibold text-muted small">Service Title</label>
                      <input
                        type="text"
                        className="form-control modern-input"
                        value={selectedService?.servicetitle || ''}
                        onChange={(e) => handleUpdateChange(e, 'servicetitle')}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold text-muted small">Service Image</label>
                      {selectedService?.serviceImage && (
                        <img
                          src={
                            selectedService.serviceImage instanceof File 
                              ? URL.createObjectURL(selectedService.serviceImage)
                              : selectedService.serviceImage
                          }
                          alt="Service"
                          className="img-thumbnail mb-2 d-block"
                          style={{ maxWidth: '200px' }}
                        />
                      )}
                      <input
                        type="file"
                        className="form-control modern-input"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'serviceImage')}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold text-muted small">Title/Description Points</label>
                      {(selectedService?.titleDescArray || []).map((item, index) => (
                        <div key={index} className="mb-3 border p-2 rounded">
                          <input
                            type="text"
                            className="form-control modern-input mb-2"
                            value={item?.title || ''}
                            onChange={(e) => handleUpdateChange(e, 'titleDescArray', index, 'title')}
                            placeholder="Title"
                          />
                          <textarea
                            className="form-control modern-input"
                            value={item?.description || ''}
                            onChange={(e) => handleUpdateChange(e, 'titleDescArray', index, 'description')}
                            placeholder="Description"
                            rows="3"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mt-2"
                            onClick={() => removeArrayItem('titleDescArray', index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm mt-2"
                        onClick={() => addArrayItem('titleDescArray')}
                      >
                        Add Point
                      </button>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold text-muted small">Categories</label>
                      {(selectedService?.categoryname || []).map((item, index) => (
                        <div key={index} className="mb-3 border p-2 rounded">
                          {item?.image && (
                            <img
                              src={
                                item.image instanceof File 
                                  ? URL.createObjectURL(item.image)
                                  : item.image
                              }
                              alt={`Category ${index}`}
                              className="img-thumbnail mb-2 d-block"
                              style={{ maxWidth: '100px' }}
                            />
                          )}
                          <input
                            type="file"
                            className="form-control modern-input mb-2"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'categoryname', index)}
                          />
                          <input
                            type="text"
                            className="form-control modern-input mb-2"
                            value={item?.title || ''}
                            onChange={(e) => handleUpdateChange(e, 'categoryname', index, 'title')}
                            placeholder="Title"
                          />
                          <textarea
                            className="form-control modern-input"
                            value={item?.description || ''}
                            onChange={(e) => handleUpdateChange(e, 'categoryname', index, 'description')}
                            placeholder="Description"
                            rows="2"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mt-2"
                            onClick={() => removeArrayItem('categoryname', index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm mt-2"
                        onClick={() => addArrayItem('categoryname')}
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer bg-light">
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => {
                    setSelectedService(null);
                    setIsCreating(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary shadow-sm"
                  onClick={handleSave}
                  disabled={!selectedService}
                >
                  {isCreating ? 'Create Service' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicepage;