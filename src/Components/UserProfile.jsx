import React from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import { MdOutlineCancel } from 'react-icons/md';
import avatar from '../Data/avatar5.jpg';

const UserProfile = ({ onLogout }) => {
  const { currentColor, setIsClicked, isClicked } = useStateContext();
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const handleLogoutClick = () => {
    setIsClicked({ ...isClicked, userProfile: false });
    if (onLogout) {
      onLogout();
    }
  };

  const handleClose = () => {
    setIsClicked({ ...isClicked, userProfile: false });
  };

  return (
    <div className="nav-item fixed md:absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-90 md:w-96 shadow-xl z-50">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <button
          type="button"
          onClick={handleClose}
          className="text-xl rounded-full p-3 hover:bg-light-gray dark:hover:bg-[#32363B] block"
          style={{ color: 'rgb(153, 171, 180)' }}
        >
          <MdOutlineCancel />
        </button>
      </div>
      
      {/* User Info Section */}
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {userId || 'User'}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {userRole || 'Role'}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            info@ftfltechnologies.com
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-5">
        <button
          onClick={handleLogoutClick}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          style={{ backgroundColor: currentColor }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
