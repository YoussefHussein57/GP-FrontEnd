// src/components/ManageUsers/ManageUsers.js
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getAllUsers, registerUser } from "../../Helpers/apiHelper";
import "./ManageUsers.css"; // Import CSS file

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getAllUsers();
      setUsers(usersData || []);
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (userId) => {
    //await removeUser(userId);
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleAddUser = async () => {
    const addedUser = await registerUser(newUser);
    setUsers([...users, addedUser]);
    setModalIsOpen(false);
    setNewUser({ name: "", role: "", password: "" });
  };

  return (
    <div className="manage-users-container">
      <h2 className="manage-users-heading">Manage Users</h2>
      <button onClick={() => setModalIsOpen(true)}>Add New User</button>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-list-item">
            {user.name} - {user.role}
            <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div className="modal">
          <h2 className="modal-heading">Add New User</h2>
          <form>
            <label className="form-label">
              Name:
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="form-inputText"
              />
            </label>
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
