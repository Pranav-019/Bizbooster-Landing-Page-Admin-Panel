import React, { useState, useEffect } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import { FiDownload, FiTrash2 } from 'react-icons/fi';

const Serviceproviders = () => {
  const { currentColor, currentMode } = useStateContext();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/service/get-services');
        if (!response.ok) {
          throw new Error('Failed to fetch service providers');
        }
        const data = await response.json();
        setServices(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/service/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service provider');
      }
      
      setServices(services.filter(service => service._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          Service Providers
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Module
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Message
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Document
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'}`}>
            {services.map((service, index) => (
              <tr key={service._id} className={index % 2 === 0 ? (currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50') : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                        {service.firstName} {service.middleName} {service.lastName}
                      </div>
                      <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
                        {service.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                    {service.phoneNumber}
                  </div>
                  <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
                    {service.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{
                      backgroundColor: currentColor + '20',
                      color: currentColor,
                    }}
                  >
                    {service.module}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm max-w-xs truncate" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                    {service.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {service.fileUrl && (
                    <a
                      href={service.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm"
                      style={{ color: currentColor }}
                    >
                      <FiDownload className="mr-1" /> Download
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <div className="text-center py-10">
          <p style={{ color: currentMode === 'Dark' ? 'white' : 'black' }}>No service providers found.</p>
        </div>
      )}
    </div>
  );
};

export default Serviceproviders;