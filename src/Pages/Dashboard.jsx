import React, { useEffect, useState } from "react";
import axios from "../axios";

const Dashboard = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary hardcoded userId for testing
  const userId = 3;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/User/${userId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            }
          }
        );
        setRoles(response.data); // Update state with response data

        console.log('data..........',response.data)
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch roles. Please try again later.");
        setLoading(false);
      }
    };

    fetchRoles();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>User Roles</h2>
      {roles.length > 0 ? (
        <ul>
          {roles.map((role) => (
            <li key={role.roleId}>
              <strong>{role.roleName}</strong>: {role.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No roles found for this user.</p>
      )}
    </div>
  );
};

export default Dashboard;
