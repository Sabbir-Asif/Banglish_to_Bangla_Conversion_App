import { FaAirbnb } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { MdRule, MdLeaderboard, MdInfo } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from '../Authentication/AuthProvider';
import Profile from "./Profile";

const Navbar = () => {
    const { user, logOut, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

    return (
        <div className="relative z-10 max-w-44 h-screen p-4">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-primary to-orange-secondary opacity-30"></div>

            <div className="relative z-20 flex flex-col h-full">
                <div>
                    <div>
                        <NavLink to={"/"}>
                            <span className="flex items-end">
                                <FaAirbnb className="text-4xl text-orange-primary" />
                                <h2 className="text-2xl md:text-xl font-bold italic">
                                    KUET
                                </h2>
                            </span>
                        </NavLink>
                    </div>
                    <div className="mt-16 flex flex-col gap-6">
                        <NavLink to={'/home/banner'}>
                            <span className="flex justify-start items-center gap-2">
                                <GoHomeFill className="text-2xl text-orange-secondary" />
                                <p className="text-md text-orange-primary font-semibold">Home</p>
                            </span>
                        </NavLink>
                        <span>
                            {
                                user && <span className="flex flex-col gap-6">
                                    <NavLink to={'/home/chat'}>
                                        <span className="flex justify-start items-center gap-2">
                                            <TbMessageChatbotFilled className="text-2xl text-orange-secondary" />
                                            <p className="text-md text-orange-primary font-semibold">Chat</p>
                                        </span>
                                    </NavLink>
                                    <NavLink to={'/records'}>
                                        <span className="flex justify-start items-center gap-2">
                                            <MdLeaderboard className="text-2xl text-orange-secondary" />
                                            <p className="text-md text-orange-primary font-semibold">Records</p>
                                        </span>
                                    </NavLink>
                                </span>
                            }
                        </span>
                        <span>
                            {
                                user && <span>
                                    <button onClick={toggleDrawer}>
                                        <div className="flex justify-start items-center gap-2">
                                            <img
                                                src={user.imageUrl || 'https://via.placeholder.com/150'}
                                                alt="Profile"
                                                className="w-7 h-7 rounded-full border-2 border-gray-300 cursor-pointer"
                                            />
                                            <p className="text-md text-orange-primary font-semibold">Profile</p>
                                        </div>
                                    </button>
                                </span>
                            }
                        </span>
                    </div>
                    <div className="mt-24 space-y-5">
                        {user ? (
                            <></>
                        ) : (
                            <>
                                <button className="py-2.5 w-full text-center rounded-sm bg-gradient-to-r from-orange-primary to-orange-secondary text-base-100 font-medium hover:border hover:border-orange-primary"
                                    onClick={handleAuthClick}
                                >
                                    Sign Up
                                </button>
                                <button
                                    className="py-2.5 w-full text-center rounded-sm bg-gradient-to-r from-orange-primary to-orange-secondary text-base-100 font-medium hover:border hover:border-orange-primary"
                                    onClick={handleAuthClick}
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-0">
                    <span className="flex gap-1 items-center text-orange-primary">
                        <MdInfo className="text-lg" />
                        <p className="font-medium">404NF</p>
                    </span>
                </div>
            </div>

            {isDrawerOpen && (
                <div className="fixed top-0 left-36 h-full w-64 bg-white shadow-lg z-50">
                    <Profile user={user} setUser={setUser} setIsDrawerOpen={setIsDrawerOpen} />
                </div>
            )}
        </div>
    );
};

export default Navbar;
