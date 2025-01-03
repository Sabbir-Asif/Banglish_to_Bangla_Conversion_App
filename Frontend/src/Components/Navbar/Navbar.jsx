import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaAirbnb } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { MdLeaderboard, MdInfo, MdAdminPanelSettings } from "react-icons/md"; // Added MdAdminPanelSettings
import { AuthContext } from '../Authentication/AuthProvider';
import Profile from "./Profile";

const Navbar = () => {
    const { user, logOut, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location]);

    const handleAuthClick = () => {
        if (user) {
            logOut()
                .then(() => {
                    window.location.reload();
                })
                .catch((error) => console.error(error));
        } else {
            navigate("/sign-in");
        }
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const NavItem = ({ to, icon, text }) => (
        <NavLink 
            to={to}
            className={({ isActive }) => 
                `group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 
                ${isActive ? 'bg-white/20 shadow-lg' : ''}`
            }
        >
            <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${activeItem === to ? 'text-white' : 'text-white/70'}`}>
                {icon}
            </span>
            <span className={`text-sm font-medium transition-colors duration-300 ${activeItem === to ? 'text-white' : 'text-white/70'}`}>
                {text}
            </span>
        </NavLink>
    );

    return (
        <div className="relative z-10 w-64 h-screen">
            {/* Background with animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-primary to-orange-secondary animate-gradient-slow">
                <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col h-full p-6">
                {/* Logo Section */}
                <div className="mb-12">
                    <NavLink to="/" className="group flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                        <FaAirbnb className="text-4xl text-white animate-pulse-slow" />
                        <h2 className="text-2xl font-bold italic text-white group-hover:text-cream-primary transition-colors duration-300">
                            BanglaBridge
                        </h2>
                    </NavLink>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-3">
                    <NavItem 
                        to="/home/banner" 
                        icon={<GoHomeFill />} 
                        text="Home" 
                    />
                    
                    {user && (
                        <>
                            <NavItem 
                                to="/home/chat" 
                                icon={<TbMessageChatbotFilled />} 
                                text="Chat" 
                            />
                            <NavItem 
                                to="/home/texteditor" 
                                icon={<MdLeaderboard />} 
                                text="Text Editor" 
                            />
                            <NavItem 
                                to="/home/Dataset" 
                                icon={<MdInfo />} 
                                text="Dataset" 
                            />
                            {user.role === 'admin' && (
                                <NavItem 
                                    to="/home/adminDashboard" 
                                    icon={<MdAdminPanelSettings />} 
                                    text="Admin Dashboard" 
                                />
                            )}
                        </>
                    )}

                    {/* Rest of the component remains the same */}
                    {/* Profile Button */}
                    {user && (
                        <button 
                            onClick={toggleDrawer}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
                        >
                            <div className="relative group">
                                <img
                                    src={user.imageUrl || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-white/30 transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <span className="text-sm font-medium text-white/70">Profile</span>
                        </button>
                    )}
                </nav>

                {/* Auth Buttons */}
                {!user && (
                    <div className="mt-auto mb-8 space-y-3">
                        <button
                            onClick={handleAuthClick}
                            className="w-full px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={handleAuthClick}
                            className="w-full px-4 py-2.5 rounded-lg bg-white text-orange-primary font-medium transition-all duration-300 hover:bg-cream-primary hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Sign In
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-auto flex items-center gap-2 px-4 py-2">
                    <span className="text-sm font-medium text-white/70">©BanglaBridge 2024. <br />All rights reserved.</span>
                </div>
            </div>

            {/* Profile Drawer */}
            {isDrawerOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={() => setIsDrawerOpen(false)}
                    ></div>
                    <div className="fixed top-0 left-64 h-full w-80 bg-white shadow-2xl z-50 animate-slide-in">
                        <Profile user={user} setUser={setUser} setIsDrawerOpen={setIsDrawerOpen} />
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animate-gradient-slow {
                    background-size: 200% 200%;
                    animation: gradient 15s ease infinite;
                }

                .animate-pulse-slow {
                    animation: pulse 3s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                .animate-slide-in {
                    animation: slideIn 0.3s ease-out forwards;
                }

                @keyframes slideIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Navbar;