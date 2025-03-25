import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import avatar from '../Data/avatar5.jpg';
import { UserProfile } from '.';
import { useStateContext } from '../Contexts/ContextProvider';

// navbar 
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = ({ onLogout }) => {
  const { 
    currentColor, 
    activeMenu, 
    setActiveMenu, 
    handleClick, 
    isClicked,
    setScreenSize, 
    screenSize 
  } = useStateContext();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userRole, setUserRole] = useState('');
  const profileRef = useRef(null);

  useEffect(() => {
    // Get role from localStorage and update state
    const role = localStorage.getItem('userRole');
    console.log('Current role:', role); // Debug log
    if (role) {
      setUserRole(role);
    }
  }, []); // Run once when component mounts

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        if (isClicked.userProfile) handleClick('userProfile');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isClicked.userProfile, handleClick]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-4 py-2 bg-white dark:bg-secondary-dark-bg shadow-md">
      {/* Left side - Hamburger */}
      <div className="flex items-center">
        {isMobile && (
          <NavButton 
            title="Menu"
            customFunc={handleActiveMenu}
            color={currentColor} 
            icon={<AiOutlineMenu />}
          />
        )}
      </div>

      {/* Right side - Profile */}
      <div className="flex items-center gap-2" ref={profileRef}>
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <img
              className="rounded-full w-8 h-8"
              src={avatar}
              alt="user-profile"
            />
            <p className="hidden md:flex items-center gap-1">
              <span className="text-gray-400 text-14">Hi,</span>{' '}
              <span className="text-gray-400 font-bold text-14">
                {userRole || ''}
              </span>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
            </p>
          </div>
        </TooltipComponent>

        {/* User Profile Popup */}
        {isClicked.userProfile && (
          <UserProfile 
            onLogout={onLogout} 
            userRole={userRole}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;



