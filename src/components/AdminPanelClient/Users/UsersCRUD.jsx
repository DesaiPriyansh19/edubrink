import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Users as UsersIcon,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import useApiData from "../../../../hooks/useApiData";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

export default function UsersCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const baseUrl = isDeletePopupOpen
    ? `https://edu-brink-backend.vercel.app/api/users`
    : `https://edu-brink-backend.vercel.app/api/users/admin`;

  const {
    data: users,
    error,
    loading,
    updateById,
    deleteById,
  } = useApiData(baseUrl);

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!userToDelete) return;

    try {
      await deleteById(id);
      setIsDeletePopupOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting university:", error);
    }
  };

  const toggleStatus = async (user) => {
    try {
      await updateById(user._id, {
        Status: !user.Status,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchQuery.toLowerCase())
    // user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/users/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users found matching your search.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{user.FullName || "N/A"}</h3>
                    <span
                      className={`${
                        user.Status
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      } text-xs px-2 py-1 rounded-full`}
                    >
                      {user.Status ? "Active" : "Not Active"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Shield className="w-4 h-4 mr-1" />
                      {user.isAdmin ? "Admin" : "Viewer"}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{user.Email}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(user)}
                    className={`${
                      user.Status
                        ? "text-green-600 hover:text-green-800"
                        : "text-gray-600 hover:text-gray-800"
                    } px-3 py-1`}
                  >
                    {!user.Status ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/${language}/admin/users/${user._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:text-red-800 px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Users</h2>
          </div>
          <p className="text-3xl font-bold">{users.length}</p>
          <p className="text-sm text-gray-500 mt-1">All users</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Active Users</h2>
          </div>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.Status).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Currently active</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Admins</h2>
          </div>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.isAdmin).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Admin users</p>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={userToDelete?.Email || ""}
        uniId={userToDelete?._id || ""}
      />
    </div>
  );
}
