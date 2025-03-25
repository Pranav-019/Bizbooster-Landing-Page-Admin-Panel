import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Displayinfo.css';

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/testimonial/get');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch testimonials');
      setLoading(false);
    }
  };

  const createNewTestimonial = () => {
    setIsCreating(true);
    setSelectedTestimonial({
      name: '',
      description: '',
      location: '',
      rating: 5,
      image: ''
    });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedTestimonial(prev => prev ? {
        ...prev,
        image: file
      } : null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTestimonial(prev => prev ? {
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    } : null);
  };

  const addTestimonial = async () => {
    if (!selectedTestimonial) return;
    
    try {
      const formData = new FormData();
      formData.append('name', selectedTestimonial.name || '');
      formData.append('description', selectedTestimonial.description || '');
      formData.append('location', selectedTestimonial.location || '');
      formData.append('rating', selectedTestimonial.rating || 5);
      if (selectedTestimonial.image instanceof File) {
        formData.append('image', selectedTestimonial.image);
      }

      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/testimonial/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create testimonial');
      }

      await fetchTestimonials();
      setSelectedTestimonial(null);
      setIsCreating(false);
      setImagePreview(null);
    } catch (err) {
      setError(err.message || 'Failed to create testimonial');
    }
  };

  const updateTestimonial = async () => {
    if (!selectedTestimonial || !selectedTestimonial._id) return;
    
    try {
      const formData = new FormData();
      formData.append('name', selectedTestimonial.name || '');
      formData.append('description', selectedTestimonial.description || '');
      formData.append('location', selectedTestimonial.location || '');
      formData.append('rating', selectedTestimonial.rating || 5);
      if (selectedTestimonial.image instanceof File) {
        formData.append('image', selectedTestimonial.image);
      }

      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/testimonial/update/${selectedTestimonial._id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update testimonial');
      }

      await fetchTestimonials();
      setSelectedTestimonial(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message || 'Failed to update testimonial');
    }
  };

  const deleteTestimonial = async (id) => {
    if (!id) return;
    
    try {
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/testimonial/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete testimonial');
      }

      await fetchTestimonials();
    } catch (err) {
      setError(err.message || 'Failed to delete testimonial');
    }
  };

  const handleSave = () => {
    if (!selectedTestimonial) return;
    
    if (isCreating) {
      addTestimonial();
    } else {
      updateTestimonial();
    }
  };

  const renderStars = (rating) => {
    const stars = rating || 0;
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`bi ${i < stars ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
          ></i>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center py-5">Loading testimonials...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-5 text-center fw-bold text-gradient">Testimonials Dashboard</h1>

      <div className="d-flex justify-content-end mb-4">
        <button 
          className="btn btn-primary shadow-sm"
          onClick={createNewTestimonial}
        >
          <i className="bi bi-plus-circle me-2"></i>Add New Testimonial
        </button>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial?._id} className="col">
            <div className="card h-100 shadow-sm border-0 hover-card">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  {testimonial?.image && (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial?.name || 'Testimonial'} 
                      className="rounded-circle me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h5 className="mb-1">{testimonial?.name || 'Anonymous'}</h5>
                    <small className="text-muted">{testimonial?.location || 'Unknown location'}</small>
                    {renderStars(testimonial?.rating)}
                  </div>
                </div>
                <p className="flex-grow-1">"{testimonial?.description || 'No description provided'}"</p>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                    onClick={() => {
                      setSelectedTestimonial(testimonial || null);
                      setIsCreating(false);
                      setImagePreview(null);
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i> Update
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger d-flex align-items-center"
                    onClick={() => testimonial?._id && deleteTestimonial(testimonial._id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(selectedTestimonial || isCreating) && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg animate-modal">
              <div className="modal-header bg-gradient-primary text-white">
                <h5 className="modal-title fw-semibold">
                  {isCreating ? 'Add New Testimonial' : `Edit: ${selectedTestimonial?.name || 'Testimonial'}`}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setSelectedTestimonial(null);
                    setIsCreating(false);
                    setImagePreview(null);
                  }}
                ></button>
              </div>
              <div className="modal-body p-4 bg-light">
                {selectedTestimonial && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Name</label>
                      <input
                        type="text"
                        className="form-control modern-input"
                        name="name"
                        value={selectedTestimonial.name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Location</label>
                      <input
                        type="text"
                        className="form-control modern-input"
                        name="location"
                        value={selectedTestimonial.location || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control modern-input"
                        name="description"
                        rows="3"
                        value={selectedTestimonial.description || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Rating (1-5)</label>
                      <select
                        className="form-select modern-input"
                        name="rating"
                        value={selectedTestimonial.rating || 5}
                        onChange={handleInputChange}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} {num !== 1 ? '' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Image</label>
                      <input
                        type="file"
                        className="form-control modern-input"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="col-12">
                      {(imagePreview || selectedTestimonial.image) && (
                        <div className="mt-3 text-center">
                          <img
                            src={imagePreview || (typeof selectedTestimonial.image === 'string' ? selectedTestimonial.image : '')}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSelectedTestimonial(null);
                    setIsCreating(false);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary shadow-sm"
                  onClick={handleSave}
                  disabled={!selectedTestimonial}
                >
                  {isCreating ? 'Create Testimonial' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonial;