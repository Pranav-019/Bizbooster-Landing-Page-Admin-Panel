import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings, FiUser, FiLock } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import axios from 'axios';

import { Navbar, Footer, Sidebar, ThemeSettings } from './Components';
import {
  Ecommerce,
  Orders,
  Calendar,
  DigitalMarketing,
  Stacked,
  Pyramid,
  Customers,
  Kanban,
  Line,
  Area,
  Bar,
  Pie,
  Financial,
  ColorMapping,
} from './Pages';
import './App.css';
import Crm from './Pages/Crm';
import Packages from './Pages/Packages';
import OurWork from './Pages/ourWork';
import Newsletter from './Pages/newsLetter';
import { useStateContext } from './Contexts/ContextProvider';
import Quotation from './Pages/Quotation';
import Design from './Pages/Design';
import Jobs from './Pages/Jobs';
import Applied from './Pages/Applied';
import JobsPosted from './Pages/JobsPosted';
import Carou from './Pages/Carou';
import Displayinfo from './Pages/Displayinfo';
import Servicepage from './Pages/Servicepage';
import Testimonial from './Pages/Testimonial';
import Video from './Pages/Video';
import Businessinfo from './Pages/Businessinfo';
import Count from './Pages/Count';
import Serviceproviders from './Pages/Serviceproviders';
import Enquiries from './Pages/Enquiries';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');

  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.clear();
  };

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('isAuthenticated', true);
    localStorage.setItem('userRole', role);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} currentMode={currentMode} />;
  }

  const roleBasedRoutes = () => {
    switch (userRole) {
      case 'CRM':
        return (
          <>
            <Route path="/crm" element={<Crm />} />
            <Route path="/Quotation" element={<Quotation />} />
            <Route path="*" element={<Navigate to="/crm" />} />
          </>
        );
      case 'TEAM':
        return (
          <>
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/orders" />} />
          </>
        );
      case 'ADMIN':
        return (
          <>
            <Route path="/Service-Page" element={<Servicepage />} />
            <Route path="/revenue" element={<Ecommerce />} />
            <Route path="/Item" element={<Displayinfo />} />
            <Route path="/Testimonial" element={<Testimonial />} />
            <Route path="/Video" element={<Video />} />
            <Route path="/Business-Info" element={<Businessinfo />} />
            <Route path="/Count" element={<Count />} />
            <Route path="/Service-Providers" element={<Serviceproviders/>} />
            <Route path="/Enquiries" element={<Enquiries/>} />
            <Route path="/carousel" element={<Carou/>} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/digitalmarketing" element={<DigitalMarketing />} />
            <Route path="/crm" element={<Crm />} />
            <Route path="/Packages" element={<Packages />} />
            <Route path="/Create Job-Posting" element={<Jobs />} />
            <Route path="/Posted Jobs" element={<JobsPosted />} />
            <Route path="/Applied-Candidates" element={<Applied />} />
            <Route path="/Our-Work" element={<OurWork />} />
            <Route path="/design" element={<Design />} />
            <Route path="/NewsLetter" element={<Newsletter />} />
            <Route path="/Quotation" element={<Quotation />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/line" element={<Line />} />
            <Route path="/area" element={<Area />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/color-mapping" element={<ColorMapping />} />
            <Route path="/pyramid" element={<Pyramid />} />
            <Route path="/stacked" element={<Stacked />} />
            <Route path="*" element={<Navigate to="/Service-Page" />} />
          </>
        );
      default:
        return <Route path="*" element={<Navigate to="/Service-Page" />} />;
    }
  };

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
              : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
          }
        >
          <div className="sticky top-0 z-50">
            <Navbar onLogout={handleLogout} />
          </div>
          <div className="mt-16">
            {themeSettings && <ThemeSettings />}
            <Routes>{roleBasedRoutes()}</Routes>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ onLogin, currentMode }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginThemeColor = '#3366ff';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userId && password) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `https://Artisticify-backend.vercel.app/api/users/getUser/${userId}`,
          { password }
        );
        if (response.data) {
          const { role } = response.data;
          onLogin(role);
        }
      } catch (err) {
        setError(
          err.response?.data?.error || 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please enter both User ID and Password');
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen p-4 ${currentMode === 'Dark' ? 'dark:bg-main-dark-bg' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg ${currentMode === 'Dark' ? 'dark:bg-secondary-dark-bg' : 'bg-white'}`}>
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4" style={{ backgroundColor: `${loginThemeColor}20` }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={loginThemeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 sm:w-10 sm:h-10"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: currentMode === 'Dark' ? 'white' : 'black' }}>
            Bizbooster Admin
          </h2>
          <p className={`mt-1 sm:mt-2 text-xs sm:text-sm ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Sign in to access your dashboard
          </p>
        </div>

        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md text-xs sm:text-sm text-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="userId" className={`block text-xs sm:text-sm font-medium mb-1 ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className={`h-4 w-4 sm:h-5 sm:w-5 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 rounded-lg border ${currentMode === 'Dark' ? 'dark:bg-gray-800 dark:border-gray-700 dark:text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                style={{ 
                  borderColor: currentMode === 'Dark' ? '#374151' : '#D1D5DB',
                  '--tw-ring-color': loginThemeColor
                }}
                placeholder="Enter your User ID"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-xs sm:text-sm font-medium mb-1 ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={`h-4 w-4 sm:h-5 sm:w-5 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 rounded-lg border ${currentMode === 'Dark' ? 'dark:bg-gray-800 dark:border-gray-700 dark:text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                style={{ 
                  borderColor: currentMode === 'Dark' ? '#374151' : '#D1D5DB',
                  '--tw-ring-color': loginThemeColor
                }}
                placeholder="Enter your Password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className={`h-4 w-4 rounded ${currentMode === 'Dark' ? 'dark:bg-gray-800 dark:border-gray-700' : 'border-gray-300'}`}
              style={{ color: loginThemeColor }}
            />
            <label htmlFor="remember-me" className={`ml-2 block text-xs sm:text-sm ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: loginThemeColor, '--tw-ring-color': loginThemeColor }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className={`mt-4 sm:mt-6 text-center text-xs sm:text-sm ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          © {new Date().getFullYear()} Bizbooster. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default App;