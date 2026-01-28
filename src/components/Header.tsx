import React, { useState } from "react";
import { CloudSun, Plus, Menu, X, User, LogOut } from "lucide-react";
import UserProfile from "./UserProfile";
import NotificationIcon from "./NotificationIcon";
import { useLocation } from "../contexts/LocationContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const Header: React.FC = () => {
  const { currentLocation, savedLocations, setCurrentLocation } = useLocation();
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setShowMobileMenu(false);
    navigate("/");
  };

  // Format current date in German
  const currentDate = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <header className="bg-blue-500 text-white rounded-t-2xl p-4 w-full lg:w-[calc(100vw-40px)] lg:ml-[-56vw] relative lg:left-1/2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="flex items-center">
              <CloudSun size={24} className="mr-2 lg:mr-2" />
              <h1 className="text-xl lg:text-2xl font-bold">APWWS</h1>
            </div>
          </div>

          {/* Desktop center content */}
          <div className="text-center flex-1 mx-4 hidden lg:block">
            <p className="text-sm">
              {currentDate} -{" "}
              {currentLocation?.name || "Kein Standort ausgewählt"}
            </p>
          </div>

          {/* Mobile location display */}
          <div className="text-center flex-1 mx-2 block lg:hidden">
            <p className="text-xs truncate">
              {currentLocation?.name || "Kein Standort"}
            </p>
          </div>

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <NotificationIcon />
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-blue-600 transition"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <User size={24} />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
                  <div className="p-1">
                    {/* Quick view + action */}
                    <div className="px-2 py-1 border-b">
                      <button
                        className="w-full text-left px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/profile');
                        }}
                      >
                        View profile page
                      </button>
                    </div>

                    <div className="p-2">
                      <UserProfile onClose={() => setShowProfileMenu(false)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-full hover:bg-blue-600 transition"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile date display below header */}
        <div className="block lg:hidden mt-2 text-center">
          <p className="text-xs opacity-90">{currentDate}</p>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-blue-400 text-white rounded-b-2xl shadow-lg relative z-50">
          <div className="p-4 space-y-3">
            <div className="w-full flex items-center justify-between p-2">
              <div className="flex items-center space-x-3">
                <NotificationIcon />
                <span className="text-sm">Benachrichtigungen</span>
              </div>
            </div>
            <button
              className="w-full flex items-center space-x-3 p-2 rounded hover:bg-blue-500 transition"
              onClick={() => {
                setShowMobileMenu(false);
                setShowProfileMenu(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-sm">Profil</span>
            </button>
            <button
              className="w-full flex items-center space-x-3 p-2 rounded hover:bg-blue-500 transition"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
