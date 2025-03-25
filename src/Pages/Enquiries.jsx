import React, { useState, useEffect } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import { FiTrash2 } from 'react-icons/fi';

const Enquiries = () => {
  const { currentColor, currentMode } = useStateContext();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/contact/get');
        if (!response.ok) {
          throw new Error('Failed to fetch enquiries');
        }
        const data = await response.json();
        // Make sure we're setting the data correctly
        setEnquiries(data); // Changed from data.data to just data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/contact/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete enquiry');
      }
      
      setEnquiries(enquiries.filter(enquiry => enquiry._id !== id));
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
          Customer Enquiries
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Service
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Message
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'}`}>
            {enquiries.length > 0 ? (
              enquiries.map((enquiry, index) => (
                <tr key={enquiry._id} className={index % 2 === 0 ? (currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50') : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                      {enquiry.FirstName} {enquiry.LastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                      {enquiry.PhoneNo}
                    </div>
                    <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
                      {enquiry.EmailAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" style={{ backgroundColor: currentColor + '20', color: currentColor }}>
                      {enquiry.Services}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm max-w-xs truncate" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                      {enquiry.Message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(enquiry._id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                    No enquiries found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enquiries;