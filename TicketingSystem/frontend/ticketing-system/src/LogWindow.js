import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

export default function LogWindow() {
  const [logs, setLogs] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://192.168.10.245:8080/logs", {
          method: "GET",
          credentials: "include", // ✅ Ensure session cookies are sent
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Error: logs response is not an array", data);
          setLogs([]);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://192.168.10.245:8080/check-role", { withCredentials: true });
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
    fetchLogs(); // Initial fetch
    const interval = setInterval(fetchLogs, 1000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Logs {userRole === 2 ? "(Admin)" : ""}
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ maxHeight: 400, overflowY: "auto" }}>
        <Table >
          <TableHead>
          <TableRow
          sx={{
          backgroundColor: "#1976d2",  // Set background color
          color: "white",              // Set text color
          position: "sticky",          // Ensure it's sticky
          top: 0,                      // Stick to the top
          zIndex: 1                 // Ensure it's above the body

          
        }} >
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>User ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No logs available, please switch to a super admin account or contact the administrator.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={log.log_id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                  {/* <TableCell>{new Date(log.action_date).toLocaleString()}</TableCell> */}
                  <TableCell>{log.action_date}</TableCell>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell>{log.action}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
