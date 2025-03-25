import React, { useState, useEffect } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';

const Businessinfo = () => {
  const { currentColor, currentMode } = useStateContext();
  const [businessData, setBusinessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/business/get');
        if (!response.ok) {
          throw new Error('Failed to fetch business data');
        }
        const data = await response.json();
        setBusinessData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

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
          Business Information
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
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Business Model
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'}`}>
            {businessData.map((business, index) => (
              <tr key={index} className={index % 2 === 0 ? (currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50') : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                        {business.firstName} {business.middleName} {business.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                    {business.phoneNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                    {business.stateProvince}, {business.pincodeZipcode}
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
                    {business.businessModel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: currentMode === 'Dark' ? 'white' : 'gray' }}>
                  {business.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Businessinfo;