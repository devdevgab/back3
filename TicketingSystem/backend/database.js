// import mysql from 'mysql2'
// import axios from 'axios';
import sql from 'mssql';
import dotenv from 'dotenv'
dotenv.config()

// const sql = require('mssql');

// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// }).promise()


const pool = new sql.ConnectionPool({
    user: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PASSWORD,
    server: process.env.SQLSERVER_HOST,
    port: parseInt(process.env.SQLSERVER_PORT),
    database: process.env.SQLSERVER_DATABASE,
    options: {
        encrypt: true, // Use encryption (recommended for Azure SQL)
        trustServerCertificate: true // Set to true if using self-signed certificates
    }
});

// const poolConnect = pool.connect(); // Connect to the SQL Server database

pool.connect()
    .then(() => {
        console.log("Connected to SQL Server");
    })
    .catch(err => {
        console.error("Connection failed: ", err);
    });




// export async function getNotes(){
//     const [rows] = await pool.query("select * from notes")
//     return rows
   
// }

// export async function getUser(id){
//     const [rows] = await pool.query(`SELECT * FROM tbl_users WHERE userId = ?`,[id])
//     return rows[0]

    

// }

export async function getUser(id) {
    try {
        const result = await pool.request()
            .input('id', sql.Int, id) // Bind the `id` parameter as an integer
            .query('SELECT * FROM tbl_users WHERE userId = @id');

        return result.recordset[0] || null; // Return the first row or null if not found
    } catch (error) {
        throw error;
    }
}
export async function logEntry(id, logDesc) {
    try {
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('logDesc', sql.VarChar, logDesc)
            .query('INSERT INTO tbl_logs (user_id, action) VALUES (@id, @logDesc)');
        
        return result.rowsAffected[0] > 0; // Return true if insertion was successful
    } catch (error) {
        throw error;
    }
}













// export async function getTicket(id){
//     const [rows] = await pool.query(`SELECT * FROM tbl_tickets WHERE ticketId = ?`,[id])
//     return rows[0]

// }

export async function getTicket(id) {
    try {
        const result = await pool.request()
            .input('id', sql.Int, id) // Bind the `id` parameter as an integer
            .query('SELECT * FROM tbl_tickets WHERE ticketId = @id');

        return result.recordset[0] || null; // Return the first row or null if not found
    } catch (error) {
        throw error;
    }
}





// getting all data from each tables in db

// export async function getCategories(){
//     const [rows] = await pool.query("select * from tbl_categories")
//     return rows
// }

// export async function getResponses(){
//     const[rows] = await pool.query("select * from tbl_responses")
//     return rows

// }

// export async function getTicketCategory(){
//     const [rows] = await pool.query("select * from tbl_ticketcategory")
//     return rows
// }
// export async function getTicketStatus(id){
//     const [rows] = await pool.query("select ticketStatus from tbl_tickets Where ticketId = ?", [id]);
//     return [rows]
// }
export async function getTicketStatus(id) {
    try {
        const result = await pool.request()
            .input('id', sql.Int, id) // Bind the `id` parameter as an integer
            .query('SELECT ticketStatus FROM tbl_tickets WHERE ticketId = @id');

        return result.recordset[0] || null; // Return the first row or null if not found
    } catch (error) {
        throw error;
    }
}












// export async function getTickets(){
//     const [rows] = await pool.query("select * from tbl_tickets WHERE ticketDeleteStatus != 1")
//     return rows
// }
export async function getTickets() {
    try {
        const result = await pool.request()
            .query('SELECT * FROM tbl_tickets WHERE ticketDeleteStatus != 1');

        return result.recordset; // Return all rows that match the query
    } catch (error) {
        throw error;
    }
}






// export async function getUsers(){
//     const [rows] = await pool.query("select * from tbl_users")
//     return rows
// }


export async function getUsers() {
    try {
        const result = await pool.request()
            .query('SELECT * FROM tbl_users');

        return result.recordset; // Return all rows from the tbl_users table
    } catch (error) {
        throw error;
    }
}








//Create functions 


//Create function for user

// export async function createUser(firstName, lastName, username, password, email, phone, department) {
//   const [result] = await pool.query(
//     'INSERT INTO tbl_users (userFirstName, userLastName, username, passwrd, userEmail, userPhone, department) VALUES (?,?,?,?,?,?,?)',
//     [firstName, lastName, username, password, email, phone, department]
//   );
//   const id = result.insertId;
//   return getUser(id);


// }
export async function createUser(firstName, lastName, username, password, email, phone, branchcode, department) {
    try {
        const result = await pool.request()
            .input('userFirstName', sql.VarChar, firstName)
            .input('userLastName', sql.VarChar, lastName)
            .input('username', sql.VarChar, username)
            .input('passwrd', sql.VarChar, password)
            .input('userEmail', sql.VarChar, email)
            .input('userPhone', sql.VarChar, phone)
            .input('branchCode', sql.VarChar, branchcode)
            .input('department', sql.VarChar, department)
            .input('role', sql.Int, 0) // Default value for role set to 0
            .query(`
                INSERT INTO tbl_users (userFirstName, userLastName, username, passwrd, userEmail, userPhone, branchCode, department, role)
                VALUES (@userFirstName, @userLastName, @username, @passwrd, @userEmail, @userPhone, @branchcode, @department, @role);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        const id = result.recordset[0].id; // Retrieve the inserted id from the result
        return getUser(id); // Fetch the newly created user using the id
    } catch (error) {
        throw error;
    }
}







// export async function createUser(req, res) {
//     try {
//       const user = new User(req.body);
//       await user.save();
//       res.json(user); // Return the newly created user data
//     } catch (error) {
//       console.error('Error creating user:', error);
//       res.status(500).json({ error: 'Failed to create user' }); // Return an error message on failure
//     }
//   }

// export async function login(username, password) {
//     try {
//         const [users] = await pool.query(
//             'SELECT * FROM tbl_users WHERE username = ? AND passwrd = ?',
//             [username, password]
//         );

//         return users[0] || null;
//     } catch (error) {
//         throw error;
//     }
// }


export async function login(username, password) {
    try {
        const result = await pool.request()
            .input('username', sql.VarChar, username) // Bind the `username` parameter
            .input('password', sql.VarChar, password) // Bind the `password` parameter
            .query(
                'SELECT * FROM tbl_users WHERE username = @username AND passwrd = @password'
            );

        return result.recordset[0] || null; // Return the first user or null if not found
    } catch (error) {
        throw error;
    }
}


// export async function createTicket(userId,TicketDepartment, BranchCode, TicketTitle,  TicketRequestedBy, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus) {
    

//     if (NumOfComputers == "" ) {

//         NumOfComputers = 0;
//     }
//     if (NumOfUsers == ""){
//         NumOfUsers = 0;
//     }

//     if (TicketDeleteStatus == ""){
//         TicketDeleteStatus =0;
        
//     }
//     TicketStatus == 0;
//     // TicketDeleteStatus == 0;
//     const [result] = await pool.query(
//         `INSERT INTO tbl_tickets (userId, ticketDepartment, branchCode, ticketTitle, ticketRequestedBy, ticketDesc, ticketServiceType, ticketServiceFor, ticketStatus, ticketNumberOfComp, ticketNumberOfUsers, ticketDeleteStatus)
//         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
//         [userId, TicketDepartment, BranchCode, TicketTitle, TicketRequestedBy,  TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus,  NumOfComputers, NumOfUsers, TicketDeleteStatus]
//     );
//     const id = result.insertId;
//     return getTicket(id);
// }

export async function createTicket(userId, TicketDepartment, BranchCode, TicketTitle, TicketRequestedBy, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus) {
    try {
        // Default values if fields are empty
        if (NumOfComputers === "") {
            NumOfComputers = 0;
        }
        if (NumOfUsers === "") {
            NumOfUsers = 0;
        }
        if (TicketDeleteStatus === "") {
            TicketDeleteStatus = 0;
        }

        // Ensure TicketStatus is set to 0 if undefined
        TicketStatus = TicketStatus || 0;

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('TicketDepartment', sql.VarChar, TicketDepartment)
            .input('BranchCode', sql.VarChar, BranchCode)
            .input('TicketTitle', sql.VarChar, TicketTitle)
            .input('TicketRequestedBy', sql.VarChar, TicketRequestedBy)
            .input('TicketDesc', sql.VarChar, TicketDesc)
            .input('TicketServiceType', sql.VarChar, TicketServiceType)
            .input('TicketServiceFor', sql.VarChar, TicketServiceFor)
            .input('TicketStatus', sql.Int, TicketStatus)
            .input('NumOfComputers', sql.Int, NumOfComputers)
            .input('NumOfUsers', sql.Int, NumOfUsers)
            .input('TicketDeleteStatus', sql.Int, TicketDeleteStatus)
            .query(`
                INSERT INTO tbl_tickets (
                    userId, ticketDepartment, branchCode, ticketTitle, 
                    ticketRequestedBy, ticketDesc, ticketServiceType, ticketServiceFor, 
                    ticketStatus, ticketNumberOfComp, ticketNumberOfUsers, ticketDeleteStatus
                )
                VALUES (
                    @userId, @TicketDepartment, @BranchCode, @TicketTitle, 
                    @TicketRequestedBy, @TicketDesc, @TicketServiceType, @TicketServiceFor, 
                    @TicketStatus, @NumOfComputers, @NumOfUsers, @TicketDeleteStatus
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        const id = result.recordset[0].id; // Get the inserted ticket ID
        return getTicket(id); // Return the newly created ticket
    } catch (error) {
        throw error;
    }
}







// export async function updateTicket(id, {TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus }) {
//     try {
//         const [result] = await pool.query('UPDATE tbl_tickets SET ticketTitle =?, ticketDesc = ?,ticketServiceType =?,ticketServiceFor =?, ticketStatus =? WHERE ticketId = ?', [TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, id]);

        
//         if (result.affectedRows > 0) {
           
//             const updatedTicket = await getTicket(id);
//             return updatedTicket;
//         } else {
            
//             return null;
//         }
//     } catch (error) {
        
//         throw error;
//     }
// }

export async function updateTicket(id, { TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus }) {
    try {
        const result = await pool.request()
            .input('TicketTitle', sql.VarChar, TicketTitle)
            .input('TicketDesc', sql.VarChar, TicketDesc)
            .input('TicketServiceType', sql.VarChar, TicketServiceType)
            .input('TicketServiceFor', sql.VarChar, TicketServiceFor)
            .input('TicketStatus', sql.Int, TicketStatus)
            .input('ticketId', sql.Int, id)
            .query(`
                UPDATE tbl_tickets 
                SET ticketTitle = @TicketTitle, ticketDesc = @TicketDesc, 
                    ticketServiceType = @TicketServiceType, ticketServiceFor = @TicketServiceFor, 
                    ticketStatus = @TicketStatus
                WHERE ticketId = @ticketId
            `);

        if (result.rowsAffected[0] > 0) { // Check if the row was updated
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // If no row was updated, return null
        }
    } catch (error) {
        throw error; // Propagate any error that occurs
    }
}



// export async function deleteTicket(id, {TicketDeleteStatus }) {
//     try {
//         const [result] = await pool.query('UPDATE tbl_tickets SET ticketDeleteStatus =? WHERE ticketId = ?', [TicketDeleteStatus, id]);

        
//         if (result.affectedRows > 0) {
           
//             const updatedTicket = await getTicket(id);
//             return updatedTicket;
//         } else {
            
//             return null;
//         }
//     } catch (error) {
        
//         throw error;
//     }
// }

export async function deleteTicket(id, { TicketDeleteStatus }) {
    try {
        const result = await pool.request()
            .input('TicketDeleteStatus', sql.Int, TicketDeleteStatus)
            .input('ticketId', sql.Int, id)
            .query(`
                UPDATE tbl_tickets 
                SET ticketDeleteStatus = @TicketDeleteStatus 
                WHERE ticketId = @ticketId
            `);

        if (result.rowsAffected[0] > 0) { // Check if the row was updated
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // If no row was updated, return null
        }
    } catch (error) {
        throw error; // Propagate any error that occurs
    }
}










// export async function getUserTickets(userId){
//     const query = `SELECT * FROM tbl_tickets WHERE ticketStatus =0 OR ticketStatus=0 OR ticketStatusICT=0  AND userId = ?`; // Adjust the table and column names as needed
//     const [tickets] = await pool.execute(query, [userId]);
//     return tickets;
//   };

export async function getUserTickets(userId) {
    try {
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT * 
                FROM tbl_tickets
                WHERE (ticketStatus = 2 OR ticketStatusICT = 2) AND userId = @userId
            `);

        return result.recordset; // Return the tickets
    } catch (error) {
        throw error; // Propagate any error that occurs
    }
}
  
// export async function getAdminTickets(id){
//     const query = `SELECT * FROM tbl_tickets WHERE userId = ?`; // Adjust the table and column names as needed
//     const [tickets] = await pool.execute(query, [id]);
//     return tickets;
//   };

export async function getPLSTickets(){
    try {
        const result = await pool.request()
            .query('SELECT * FROM tbl_tickets ');

        return result.recordset; // Return the tickets
    } catch (error) {
        throw error; // Propagate any error that occurs
    }

}

export async function getAdminTickets(id) {
    try {
        const result = await pool.request()
            .input('userId', sql.Int, id)
            .query('SELECT * FROM tbl_tickets WHERE userId = @userId');

        return result.recordset; // Return the tickets
    } catch (error) {
        throw error; // Propagate any error that occurs
    }
}

export async function getATickets() {
    try {
        const result = await pool.request()
            .query('SELECT * FROM tbl_tickets ');

        return result.recordset; // Return the tickets
    } catch (error) {
        throw error; // Propagate any error that occurs
    }
}



//   export async function getAllTickets(){
//     const query = `SELECT * FROM tbl_tickets`; // Adjust the table and column names as needed
//     const [tickets] = await pool.execute(query);
//     return tickets;
//   };


export const getAllTickets = async () => {
    try {
        const result = await pool.request().query('SELECT * FROM tbl_tickets');
        return result.recordset; // Return the records from the query
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
};


export const getAcceptedTickets = async () => {
    try {
        const result = await pool.request().query('SELECT * FROM tbl_tickets WHERE ticketStatusICT = 1 AND ticketStatus = 1');
        return result.recordset; // Return the filtered tickets
    } catch (error) {
        console.error('Error fetchingssssssssss accepted tickets:', error.message);
        throw error;
    }
};

// export async function getAdminTickets(id) {
//     try {
//         const result = await pool.request()
//             .input('userId', sql.Int, id)
//             .query('SELECT * FROM tbl_tickets WHERE userId = @userId');

//         return result.recordset; // Return the tickets
//     } catch (error) {
//         throw error; // Propagate any error that occurs
//     }
// }






//   export async function getTickets(){
//     const [rows] = await pool.query("select * from tbl_tickets WHERE ticketDeleteStatus != 1")
//     return rows
// }

// export async function acceptTicket(name, id) {
//     const ticketStatus = 1; // Accepted
//     const ticketResoDate = new Date(); // Current date and time for resolution date


//     try {
//         const [result] = await pool.query(
//             'UPDATE tbl_tickets SET ticketStatus = ?, ticketResoDate = ?, ticketAuthorAccepted = ? WHERE ticketId = ?',
//             [ticketStatus, ticketResoDate, name, id]
//         );

//         if (result.affectedRows > 0) {
//             const updatedTicket = await getTicket(id); // Fetch the updated ticket
//             return updatedTicket;
//         } else {
//             return null; // Ticket not found or not updated
//         }
//     } catch (error) {
//         throw error; // Handle error appropriately
//     }
// }


export async function acceptTicket(name, id) {
    const ticketStatus = 1; // Accepted
    const ticketResoDate = new Date(); // Current date and time for resolution date

    try {
        const result = await pool.request()
            .input('ticketStatus', sql.Int, ticketStatus)
            .input('ticketResoDate', sql.DateTime, ticketResoDate)
            .input('ticketAuthorAccepted', sql.VarChar, name)
            .input('ticketId', sql.Int, id)
            .query(
                'UPDATE tbl_tickets SET ticketStatus = @ticketStatus, ticketResoDate = @ticketResoDate, ticketAuthorAccepted = @ticketAuthorAccepted WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}


// export async function acceptTicketICT(name, id) {
//     const ticketStatusICT = 1; // Accepted
//     const ticketResoDate = new Date(); // Current date and time for resolution date


//     try {
//         const [result] = await pool.query(
//             'UPDATE tbl_tickets SET ticketStatusICT = ?, ticketResoDate = ?, ticketAuthorICTAccepted = ? WHERE ticketId = ?',
//             [ticketStatusICT, ticketResoDate, name, id]
//         );

//         if (result.affectedRows > 0) {
//             const updatedTicket = await getTicket(id); // Fetch the updated ticket
//             return updatedTicket;
//         } else {
//             return null; // Ticket not found or not updated
//         }
//     } catch (error) {
//         throw error; // Handle error appropriately
//     }
// }

export async function acceptTicketICT(name, id) {
    const ticketStatusICT = 1; // Accepted
    const ticketResoDate = new Date(); // Current date and time for resolution date

    try {
        const result = await pool.request()
            .input('ticketStatusICT', sql.Int, ticketStatusICT)
            .input('ticketResoDate', sql.DateTime, ticketResoDate)
            .input('ticketAuthorICTAccepted', sql.VarChar, name)
            .input('ticketId', sql.Int, id)
            .query(
                'UPDATE tbl_tickets SET ticketStatusICT = @ticketStatusICT, ticketResoDate = @ticketResoDate, ticketAuthorICTAccepted = @ticketAuthorICTAccepted WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}

export async function closeTicket(id) {
    const ticketClosed = 2; // Closed
    const ticketResoDate = new Date(); // Current date and time for resolution date

    try {
        const result = await pool.request()
            .input('ticketClosed', sql.Int, ticketClosed)
            .input('ticketId', sql.Int, id)
            .query(
                'UPDATE tbl_tickets SET ticketResolved = @ticketClosed WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}

export async function openTicket(id) {
    const ticketClosed = 0; // Open
    const ticketResoDate = new Date(); // Current date and time for resolution date

    try {
        const result = await pool.request()
            .input('ticketClosed', sql.Int, ticketClosed)
            .input('ticketId', sql.Int, id)
            .query(
                'UPDATE tbl_tickets SET ticketResolved = @ticketClosed WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}
export async function inProgressTicket(id) {
    const ticketClosed = 1; // Open
    const ticketResoDate = new Date(); // Current date and time for resolution date

    try {
        const result = await pool.request()
            .input('ticketClosed', sql.Int, ticketClosed)
            .input('ticketId', sql.Int, id)
            .query(
                'UPDATE tbl_tickets SET ticketResolved = @ticketClosed WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}

export async function getLogs(limit = 500) {
    try {
      const result = await pool
        .request()
        .input("limit", sql.Int, limit)
        .query(`
          SELECT TOP (@limit) log_id, user_id, action, action_date 
          FROM tbl_logs 
          ORDER BY action_date DESC
        `);
  
      return result.recordset || []; // Return logs as an array
    } catch (error) {
      console.error("Error fetching logs:", error);
      return []; // Propagate error to be handled in the route
    }
  }


// export async function declineTicketICT(name, id) {
//     const ticketStatusICT = 0; // Not accepted
//     const ticketResoDate = new Date(); // No resolution date for declined tickets

//     try {
//         const [result] = await pool.query(
//             'UPDATE tbl_tickets SET ticketStatusICT = ?, ticketResoDate = ?, ticketAuthorICTDeclined = ? WHERE ticketId = ?',
//             [ticketStatusICT, ticketResoDate, name, id]
//         );

//         if (result.affectedRows > 0) {
//             const updatedTicket = await getTicket(id);
//             return updatedTicket;
//         } else {
//             return null; // Ticket not found or not updated
//         }
//     } catch (error) {
//         throw error; // Handle error appropriately
//     }
// }
export async function plsTicket (id){
    const ticketStatus = 3; // PLS
    const ticketResoDate = new Date(); // Current date and time for resolution date

    try {
        const result = await pool.request()
            .input('ticketStatus', sql.Int, ticketStatus) 
            .input('ticketId', sql.Int, id)
            
            .query(
                'UPDATE tbl_tickets SET ticketResolved = @ticketStatus WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}
export async function uploadRemarks(ticketId, ticketRemarks) {
    try {
        const result = await pool.request()
            .input('ticketId', sql.Int, ticketId)
            .input('ticketRemarks', sql.VarChar, ticketRemarks)  // Use the correct variable
            
            .query(
                'UPDATE tbl_tickets SET ticketRemarks = @ticketRemarks WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(ticketId);
            return updatedTicket;
        } else {
            return null; // No rows affected
        }
    } catch (error) {
        throw error;
    }
}

export async function declineTicketICT(name, id) {
    const ticketStatusICT = 0; // Not accepted
    const ticketResoDate = new Date(); // No resolution date for declined tickets

    try {
        const result = await pool.request()
            .input('ticketStatusICT', sql.Int, ticketStatusICT)
            .input('ticketResoDate', sql.DateTime, ticketResoDate)
            .input('ticketAuthorICTDeclined', sql.VarChar, name)
            .input('ticketId', sql.Int, id)
            .query(
                'UPDATE tbl_tickets SET ticketStatusICT = @ticketStatusICT, ticketResoDate = @ticketResoDate, ticketAuthorICTDeclined = @ticketAuthorICTDeclined WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}
// export async function declineTicket(name, id) {
//     const ticketStatus = 0; // Not accepted
//     const ticketResoDate = new Date(); // No resolution date for declined tickets

//     try {
//         const [result] = await pool.query(
//             'UPDATE tbl_tickets SET ticketStatus = ?, ticketResoDate = ?, ticketAuthorDeclined = ? WHERE ticketId = ?',
//             [ticketStatus, ticketResoDate, name, id]
//         );

//         if (result.affectedRows > 0) {
//             const updatedTicket = await getTicket(id);
//             return updatedTicket;
//         } else {
//             return null; // Ticket not found or not updated
//         }
//     } catch (error) {
//         throw error; // Handle error appropriately
//     }
// }
export async function declineTicket(name, id) {
    const ticketStatus = 0; // Not accepted
    const ticketResoDate = new Date(); // No resolution date for declined tickets

    try {
        const result = await pool.request()
            .input('ticketStatus', sql.Int, ticketStatus)
            .input('ticketResoDate', sql.DateTime, ticketResoDate)
            .input('ticketAuthorDeclined', sql.VarChar, name)
            .input('ticketId', sql.Int, id)
            .query(
                'UPDATE tbl_tickets SET ticketStatus = @ticketStatus, ticketResoDate = @ticketResoDate, ticketAuthorDeclined = @ticketAuthorDeclined WHERE ticketId = @ticketId'
            );

        if (result.rowsAffected[0] > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}



// export async function authorAccepted(name, ticketId) {
//     const ticketAcceptedDate = new Date();
//     try {
//         // Use ticketId and other required values in the query
//         const [result] = await pool.query(
//             'INSERT INTO tbl_verdict (ticketId, ticketAuthor, ticketAcceptedBy, ticketDeclineBy, ticketAcceptedDate, ticketDeclinedDate) VALUES (?, ?, ?, ?, ?, ?)',
//             [ticketId, name, name, null, ticketAcceptedDate, null] // Adjust the values as per your requirements
//         );
//         return result.affectedRows > 0; // Return true if a row was inserted
//     } catch (error) {
//         console.error('Database error:', error);
//         throw error; // Rethrow the error to be handled by the caller
//     }
// }

export async function authorAccepted(name, ticketId) {
    const ticketAcceptedDate = new Date();
    try {
        const result = await pool.request()
            .input('ticketId', sql.Int, ticketId)
            .input('ticketAuthor', sql.VarChar, name)
            .input('ticketAcceptedBy', sql.VarChar, name)
            .input('ticketDeclineBy', sql.VarChar, null)
            .input('ticketAcceptedDate', sql.DateTime, ticketAcceptedDate)
            .input('ticketDeclinedDate', sql.DateTime, null)
            .query(
                'INSERT INTO tbl_verdict (ticketId, ticketAuthor, ticketAcceptedBy, ticketDeclineBy, ticketAcceptedDate, ticketDeclinedDate) VALUES (@ticketId, @ticketAuthor, @ticketAcceptedBy, @ticketDeclineBy, @ticketAcceptedDate, @ticketDeclinedDate)'
            );

        return result.rowsAffected[0] > 0; // Return true if a row was inserted
    } catch (error) {
        console.error('Database error:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}





export async function authorDeclined(){
    const ticketDeclinedDate= new Date();

}















// Function to decline a ticket

































// export async function checkLoginStatus() {
//     try {
//       const response = await axios.get('http://localhost:8080/check-login', { withCredentials: true });
        
//       return response.data; // Return the entire response containing loggedIn and role
     
//     } catch (error) {
//       console.error('Error checking login status:', error);
//       return { loggedIn: false, role: null }; // Consider user as not logged in on error
//     }
//   }
export async function checkLoginStatus(req, res) {
    try {
        // Assuming that login status is stored in session
        if (req.session.userId) {
            const userId = req.session.userId;

            // Query to check user's role
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT role FROM tbl_users WHERE userId = @userId');

            if (result.recordset.length > 0) {
                return res.json({ loggedIn: true, role: result.recordset[0].role });
            } else {
                return res.json({ loggedIn: false, role: null });
            }
        } else {
            return res.json({ loggedIn: false, role: null });
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        return res.status(500).json({ loggedIn: false, role: null });
    }
}




  

//   export async function checkUserRole() {
//     try {
//         const response = await axios.get('http://localhost:8080/check-role', { withCredentials: true });
//         return response.data; // This will return { userId, role }
//     } catch (error) {
//         console.error('Error checking user role:', error);
//         return { userId: null, role: null }; // Handle error case
//     }
// }
export async function checkUserRole(req, res) {
    try {
        // Check if userId is present in the session
        if (req.session.userId) {
            const userId = req.session.userId;

            // Query to fetch userId and role from the database
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT userId, role FROM tbl_users WHERE userId = @userId');

            if (result.recordset.length > 0) {
                // Return userId and role if found
                return res.json({ userId: result.recordset[0].userId, role: result.recordset[0].role });
            } else {
                // If userId not found, return nulls
                return res.json({ userId: null, role: null });
            }
        } else {
            // If session doesn't have userId, return nulls
            return res.json({ userId: null, role: null });
        }
    } catch (error) {
        console.error('Error checking user role:', error);
        return res.status(500).json({ userId: null, role: null }); // Handle server error
    }
}
  

// export async function makeAdmin(userId) {
//     if (!userId) {
//         throw new Error('Invalid userId');
//     }

//     // Assuming the role of '1' represents admin in your database
//     const [result] = await pool.query(
//         'UPDATE tbl_users SET role = 1 WHERE userId = ?',
//         [userId]
//     );

//     if (result.affectedRows === 0) {
//         throw new Error('User not found or already an admin');
//     }

//     return { message: 'User successfully promoted to admin' };
// }

export async function makeAdmin(userId) {
    if (!userId) {
        throw new Error('Invalid userId');
    }

    try {
        // Assuming role '1' represents admin in your database
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('role', sql.Int, 1) // Set role to 1 (admin)
            .query('UPDATE tbl_users SET role = @role WHERE userId = @userId');

        if (result.rowsAffected[0] === 0) {
            throw new Error('User not found or already an admin');
        }

        return { message: 'User successfully promoted to admin' };
    } catch (error) {
        console.error('Error making user admin:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}



// export async function makeUser(userId) {
//     if (!userId) {
//         throw new Error('Invalid userId');
//     }

//     // Assuming the role of '0' represents a regular user in your database
//     const [result] = await pool.query(
//         'UPDATE tbl_users SET role = 0 WHERE userId = ?',[userId]
//     );

//     if (result.affectedRows === 0) {
//         throw new Error('User not found or already a regular user');
//     }
//     console.log(userId)

//     return { message: 'User successfully demoted to regular user' };

// }

export async function makeUser(userId) {
    if (!userId) {
        throw new Error('Invalid userId');
    }

    try {
        // Assuming role '0' represents a regular user in your database
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('role', sql.Int, 0) // Set role to 0 (regular user)
            .query('UPDATE tbl_users SET role = @role WHERE userId = @userId');

        if (result.rowsAffected[0] === 0) {
            throw new Error('User not found or already a regular user');
        }

        console.log(userId);

        return { message: 'User successfully demoted to regular user' };
    } catch (error) {
        console.error('Error demoting user:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export const fetchBranches = async () => {
    try {
        const result = await pool.request().query('SELECT * FROM tbl_branches');
        return result.recordset; // Return the records from the query
    } catch (error) {
        console.error('Error fetching branches:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export const getBranchTickets = async (branchCode) => {
    try {
        const result = await pool.request()
            .input('branchCode', sql.VarChar, branchCode) // Bind the branchCode parameter
            .query('SELECT * FROM tbl_tickets WHERE branchCode = @branchCode');
        return result.recordset; // Return the records from the query
    } catch (error) {
        console.error('Error fetching branches:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};



export const getUserDetails = async (userId) => {
    try {
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM tbl_users WHERE userId = @userId');
        return result.recordset[0]; // Return the user details
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};


export const getTicketResolved = async (userId) => {
    try {
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM tbl_tickets WHERE userId = @userId');

        return result.recordset; // Return all user tickets
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const getTicketResolvedAdmin = async () => {
    try {
        const result = await pool.request()
            .query('SELECT * FROM tbl_tickets'); // Removed invalid userId input

        return result.recordset; // Return all tickets
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
};
