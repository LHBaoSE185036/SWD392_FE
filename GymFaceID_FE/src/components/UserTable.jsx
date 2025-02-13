import React from "react";
import "./styles/UserManagement.css";
import { DeleteOutline, DriveFileRenameOutline, VisibilityOutlined } from "@mui/icons-material";

const users = [
  { id: 1, name: "User1 Full Name", birthday: "01/01/2001" },
  { id: 2, name: "User2 Full Name", birthday: "02/02/2002" },
  { id: 3, name: "User3 Full Name", birthday: "03/03/2003" },
  { id: 4, name: "User4 Full Name", birthday: "04/04/2004" },
];

const UserTable = () => {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Birthday</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.birthday}</td>
            <td>
              <button className="view-btn"><VisibilityOutlined /></button>
              <button className="delete-btn"><DeleteOutline /></button>
              <button className="edit-btn"><DriveFileRenameOutline /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;