import React, { useContext, useState } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { AuthContext } from "../Authentication/AuthProvider";
import axios from "axios";

const Profile = ({ user, setUser, setIsDrawerOpen }) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const { logOut } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateProfilePicture = async () => {
    if (!newImageUrl) return;

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/users/${user._id}`,
        {
          displayName: user.displayName,
          email: user.email,
          imageUrl: newImageUrl,
        }
      );
      setUser(response.data);
      setNewImageUrl("");
      alert("Profile picture updated");
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleLogout = () => {
    logOut();
    setIsDrawerOpen(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-black-primary shadow-lg w-full h-full font-poppins border border-orange-primary pb-16 bg-opacity-90 backdrop-blur-md">
      {/* Close Drawer Button */}
      <button
        onClick={() => setIsDrawerOpen(false)}
        className="self-end text-xl text-blue- hover:text-gray-300 mb-4"
      >
        &times;
      </button>

      {/* Profile Card */}
      <div className="relative bg-gradient-to-r from-orange-secondary to-orange-primary bg-transparent bg-opacity-50 p-6 rounded-xl shadow-lg text-center w-full max-w-md backdrop-blur-md">
        <div className="relative mx-auto w-28 h-28">
          <img
            src={user.imageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-full border-4 border-white shadow-lg w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">{user.displayName}</h2>
        <p className="text-sm text-gray-200 italic">{user.email}</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-2 text-sm text-blue-200 hover:text-blue-300 underline"
        >
          View Profile Picture
        </button>
      </div>

      {/* Update Profile Section */}
      <div className="w-full mt-6 max-w-md">
        <input
          type="text"
          placeholder="Enter New Image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="w-full p-3 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
        />
        <button
          onClick={handleUpdateProfilePicture}
          className="btn btn-outline font-poppins hover:bg-orange-secondary hover:border-orange-secondary transform hover:scale-105 transition-all duration-300 ease-in-out mt-4 w-full"
        >
          Update Profile Picture
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-orange-primary to-orange-secondary rounded-md shadow-md transition hover:brightness-110 transform hover:scale-105 duration-300 animate-bounce-subtle"
      >
        <RiLogoutBoxRLine className="text-xl" />
        <span className="text-sm font-semibold ">Log Out</span>
      </button>

      {/* Modal for Full Profile Picture */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <img
              src={user.imageUrl || "https://via.placeholder.com/150"}
              alt="Full Profile"
              className="w-80 h-80 rounded-md object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
