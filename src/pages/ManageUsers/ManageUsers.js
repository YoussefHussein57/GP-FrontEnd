import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getAllUsers, registerUser } from "../../Helpers/apiHelper";
import "./ManageUsers.css"; // Import CSS file

const ManageUsers = () => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response && response.data && response.data.users) {
          setUsers(response.data.users);
          localStorage.setItem("users", JSON.stringify(response.data.users));
        } else {
          setUsers([]);
          localStorage.removeItem("users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, [fetchTrigger]); // Dependency array includes fetchTrigger to re-fetch on add/remove

  const handleRemoveUser = async (userId) => {
    try {
      // Implement your remove user logic here
      // Example: await removeUser(userId);
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setFetchTrigger(!fetchTrigger);
    } catch (error) {
      console.error("Error removing user:", error);
      setError("Failed to remove user. Please try again.");
    }
  };

  const handleAddUser = async () => {
    try {
      const addedUser = await registerUser(newUser);
      if (addedUser) {
        const updatedUsers = [...users, addedUser];
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setModalIsOpen(false);
        setNewUser({
          firstName: "",
          lastName: "",
          role: "",
          email: "",
          password: "",
        });
        setFetchTrigger(!fetchTrigger); // Optional: Trigger fetch to update user list
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="manage-users-container">
      <h2 className="manage-users-heading">Manage Users</h2>
      {error && <div className="error-message">{error}</div>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="user-list-item">
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleRemoveUser(user._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setModalIsOpen(true)} className="newUser-Button">
        Add New User
      </button>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div className="modal">
          <h2 className="modal-heading">Add New User</h2>
          <form>
            <label className="form-label">
              First Name:
              <input
                type="text"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                className="form-inputText"
              />
            </label>
            <label className="form-label">Last Name:</label>
            <input
              type="text"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              className="form-inputText"
            />
            <label className="form-label">Role:</label>
            <input
              type="text"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="form-inputText"
            />

            <label className="form-label">Email:</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="form-input"
            />

            <label className="form-label">Password:</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="form-input"
            />

            <button
              type="button"
              onClick={handleAddUser}
              className="form-button"
            >
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
