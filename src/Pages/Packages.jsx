import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, FormControl, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import './css/Packages.css';

const Packages = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    price: '',
    features: '',
    isActive: true,
  });

  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://Artisticify-backend.vercel.app/api/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setMessage('Failed to fetch packages.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };

  // Handle form submission for creating a new package
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features.split(',').map((feature) => feature.trim()),
      };

      const response = await axios.post('https://Artisticify-backend.vercel.app/api/packages', payload);
      setPackages((prevPackages) => [...prevPackages, response.data]);
      setMessage('Package created successfully!');
      setFormData({
        name: '',
        type: '',
        category: '',
        price: '',
        features: '',
        isActive: true,
      });
    } catch (error) {
      console.error('Error creating package:', error.response?.data || error.message);
      setMessage('Failed to create package. Please check the input.');
    }
  };

  // Handle package deletion
  const deletePackage = async (packageId) => {
    try {
      const response = await axios.delete(`https://Artisticify-backend.vercel.app/api/packages/${packageId}`);
      if (response.status === 200) {
        setPackages((prevPackages) =>
          prevPackages.filter((pkg) => pkg._id !== packageId)
        );
        setMessage('Package deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      setMessage('Failed to delete package.');
    }
  };

  // Handle inline editing in the table
  const handleRowChange = (e, field, packageId) => {
    const updatedPackages = packages.map((pkg) =>
      pkg._id === packageId ? { ...pkg, [field]: e.target.value } : pkg
    );
    setPackages(updatedPackages);
  };

  const saveInlineEdit = async (packageId) => {
    const pkg = packages.find((pkg) => pkg._id === packageId);
    try {
      await axios.put(`https://Artisticify-backend.vercel.app/api/packages/${packageId}`, {
        ...pkg,
        features: pkg.features.split(',').map((feature) => feature.trim()),
      });
      setMessage('Package updated successfully!');
      setEditingRow(null);
    } catch (error) {
      console.error('Error updating package:', error.response?.data || error.message);
      setMessage('Failed to update package.');
    }
  };

  return (
    <div className="package-container">
      <h1>Manage Packages</h1>
      {message && <p className="message">{message}</p>}

      {/* Package list table */}
      <h2>Existing Packages</h2>
      {loading ? (
        <p>Loading packages...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Price</th>
              <th>Features</th>
              <th>Is Active</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id}>
                {editingRow === pkg._id ? (
                  <>
                    <td>
                      <FormControl
                        value={pkg.name}
                        onChange={(e) => handleRowChange(e, 'name', pkg._id)}
                      />
                    </td>
                    <td>
                      <FormControl
                        as="select"
                        value={pkg.type}
                        onChange={(e) => handleRowChange(e, 'type', pkg._id)}
                      >
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                      </FormControl>
                    </td>
                    <td>
                      <FormControl
                        value={pkg.category}
                        onChange={(e) => handleRowChange(e, 'category', pkg._id)}
                      />
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handleRowChange(e, 'price', pkg._id)}
                      />
                    </td>
                    <td>
                      <FormControl
                        value={pkg.features}
                        onChange={(e) => handleRowChange(e, 'features', pkg._id)}
                      />
                    </td>
                    <td>
                      <FormControl
                        as="select"
                        value={pkg.isActive ? 'true' : 'false'}
                        onChange={(e) =>
                          handleRowChange(
                            { target: { value: e.target.value === 'true' } },
                            'isActive',
                            pkg._id
                          )
                        }
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </FormControl>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => saveInlineEdit(pkg._id)}
                      >
                        Save
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{pkg.name}</td>
                    <td>{pkg.type}</td>
                    <td>{pkg.category}</td>
                    <td>{pkg.price}</td>
                    <td>{pkg.features}</td>
                    <td>{pkg.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => setEditingRow(pkg._id)}
                      >
                        Edit
                      </Button>
                    </td>
                  </>
                )}
                <td>
                  <FaTrash
                    size={20}
                    onClick={() => deletePackage(pkg._id)}
                    style={{ cursor: 'pointer', color: 'red' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Package creation form */}
      <h2>Create New Package</h2>
      <form className="package-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Select Type</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Features (comma-separated):</label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Is Active:</label>
          <select
            name="isActive"
            value={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === 'true' })
            }
            className="form-input"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Create Package
        </button>
      </form>
    </div>
  );
};

export default Packages;
