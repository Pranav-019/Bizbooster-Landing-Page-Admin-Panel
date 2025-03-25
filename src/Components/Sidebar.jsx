import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { links } from "../Data/dummy";
import { useStateContext } from "../Contexts/ContextProvider";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu } = useStateContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => setActiveMenu(false);

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const SidebarContent = () => (
    <div className="h-screen overflow-auto pb-10">
      <div className="flex flex-col items-center">
        <Link 
          to="/" 
          onClick={isMobile ? handleClose : undefined}
          className="flex items-center gap-3 mt-16 text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
        >
          <h1 className="text-3xl font-bold" style={{ color: currentColor }}>Bizbooster 2x</h1>
        </Link>
      </div>

      <div className="mt-5">
        {links.map((item) => (
          <div key={item.title}>
            <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
              {item.title}
            </p>
            {item.links.map((link) => (
              <NavLink
                to={`/${link.name}`}
                key={link.name}
                onClick={isMobile ? handleClose : undefined}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
              >
                {link.icon}
                <span className="capitalize">{link.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-72 fixed sidebar bg-white dark:bg-secondary-dark-bg">
          <SidebarContent />
        </div>
      )}

      {/* Mobile Offcanvas */}
      {isMobile && (
        <Offcanvas 
          show={activeMenu} 
          onHide={handleClose}
          placement="start"
          style={{ width: '272px' }}
          className="bg-white dark:bg-secondary-dark-bg"
        >
          <Offcanvas.Header closeButton={false} className="justify-content-end p-2">
            <MdOutlineCancel 
              style={{ color: currentColor, cursor: 'pointer' }} 
              onClick={handleClose} 
              className="ms-auto"
            />
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <SidebarContent />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
};

export default Sidebar;