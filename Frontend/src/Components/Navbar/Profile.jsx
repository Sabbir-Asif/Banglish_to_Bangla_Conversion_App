import React, { useContext, useState } from 'react';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { AuthContext } from '../Authentication/AuthProvider';
import axios from 'axios';

const Profile = ({ user, setUser, setIsDrawerOpen }) => {
    const [newImageUrl, setNewImageUrl] = useState('');
    const { logOut } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleUpdateProfilePicture = async () => {
        if (!newImageUrl) return;

        try {
            const response = await axios.patch(`http://localhost:3000/api/users/${user._id}`, {
                displayName: user.displayName,
                email: user.email,
                imageUrl: newImageUrl,
            });
            setUser(response.data);
            setNewImageUrl('');
            alert('Profile picture updated');
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    const handleLogout = () => {
        logOut();
        setIsDrawerOpen(false);
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center p-6 bg-black-primary shadow-lg w-full h-full font-poppins border border-orange-primary pb-16">
            <button
                onClick={() => setIsDrawerOpen(false)}
                className="self-end text-green-info text-2xl hover:text-gray-600 mb-2"
            >
                &times;
            </button>
            <div className="shadow-lg w-full flex flex-col justify-center items-center border border-orange-primary rounded-lg mb-6 py-3">
                <img
                    src={user.imageUrl || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="rounded-full w-28 h-28 mb-3 shadow-md border-2 border-blue-primary cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                />
                <div className="text-sm font-light mb-1 text-cream-primary italic">{user.email}</div>
                <div className="text-lg font-medium text-orange-secondary mb-4">{user.displayName}</div>
            </div>
            <div className="w-full mb-4">
                <input
                    type="text"
                    placeholder="New Image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="input input-bordered text-sm bg-base-300 h-10 w-full mb-2 px-3"
                />
                <button
                    onClick={handleUpdateProfilePicture}
                    className="btn-link text-cream-primary hover:text-orange-secondary text-sm underline"
                >
                    Update Profile Picture
                </button>
            </div>
            <div className="flex justify-start w-full mt-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 mt-4 p-2 rounded-md text-base-100 bg-red-400 hover:bg-error hover:text-green-info"
                >
                    <RiLogoutBoxRLine className='text-2xl' />
                    <span className='text-sm font-semibold'>
                        Log Out
                    </span>
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center ml-48 bg-black bg-opacity-70">
                    <div className="bg-black-primary p-4 rounded-md shadow-lg">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="self-end text-gray-400 text-2xl hover:text-gray-600 mb-2"
                        >
                            &times;
                        </button>
                        <img
                            src={user.imageUrl || 'https://via.placeholder.com/150'}
                            alt="Profile Large View"
                            className="w-80 h-80 rounded-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
