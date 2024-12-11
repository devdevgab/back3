import mysql from 'mysql2'
// import axios from 'axios';

import dotenv from 'dotenv'
dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getNotes(){
    const [rows] = await pool.query("select * from notes")
    return rows
   
}

export async function getUser(id){
    const [rows] = await pool.query(`SELECT * FROM tbl_users WHERE userId = ?`,[id])
    return rows[0]

}

export async function getTicket(id){
    const [rows] = await pool.query(`SELECT * FROM tbl_tickets WHERE ticketId = ?`,[id])
    return rows[0]

}


// getting all data from each tables in db

export async function getCategories(){
    const [rows] = await pool.query("select * from tbl_categories")
    return rows
}

export async function getResponses(){
    const[rows] = await pool.query("select * from tbl_responses")
    return rows

}

export async function getTicketCategory(){
    const [rows] = await pool.query("select * from tbl_ticketcategory")
    return rows
}
export async function getTicketStatus(id){
    const [rows] = await pool.query("select ticketStatus from tbl_tickets Where ticketId = ?", [id]);
    return [rows]
}

export async function getTickets(){
    const [rows] = await pool.query("select * from tbl_tickets WHERE ticketDeleteStatus != 1")
    return rows
}


export async function getUsers(){
    const [rows] = await pool.query("select * from tbl_users")
    return rows
}

//Create functions 


//Create function for user

export async function createUser(firstName, lastName, username, password, email, phone, department) {
  const [result] = await pool.query(
    'INSERT INTO tbl_users (userFirstName, userLastName, username, passwrd, userEmail, userPhone, department) VALUES (?,?,?,?,?,?,?)',
    [firstName, lastName, username, password, email, phone, department]
  );
  const id = result.insertId;
  return getUser(id);


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

export async function login(username, password) {
    try {
        const [users] = await pool.query(
            'SELECT * FROM tbl_users WHERE username = ? AND passwrd = ?',
            [username, password]
        );

        return users[0] || null;
    } catch (error) {
        throw error;
    }
}


export async function createTicket(userId,TicketDepartment, TicketTitle,  TicketRequestedBy, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus) {
    

    if (NumOfComputers == "" ) {

        NumOfComputers = 0;
    }
    if (NumOfUsers == ""){
        NumOfUsers = 0;
    }

    if (TicketDeleteStatus == ""){
        TicketDeleteStatus =0;
        
    }
    TicketStatus == 0;
    // TicketDeleteStatus == 0;
    const [result] = await pool.query(
        `INSERT INTO tbl_tickets (userId, ticketDepartment, ticketTitle, ticketRequestedBy,  ticketDesc, ticketServiceType, ticketServiceFor, ticketStatus,  ticketNumberOfComp, ticketNumberOfUsers, ticketDeleteStatus)
        VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?)`,
        [userId, TicketDepartment, TicketTitle, TicketRequestedBy,  TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus,  NumOfComputers, NumOfUsers, TicketDeleteStatus]
    );
    const id = result.insertId;
    return getTicket(id);
}





export async function updateTicket(id, {TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus }) {
    try {
        const [result] = await pool.query('UPDATE tbl_tickets SET ticketTitle =?, ticketDesc = ?,ticketServiceType =?,ticketServiceFor =?, ticketStatus =? WHERE ticketId = ?', [TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, id]);

        
        if (result.affectedRows > 0) {
           
            const updatedTicket = await getTicket(id);
            return updatedTicket;
        } else {
            
            return null;
        }
    } catch (error) {
        
        throw error;
    }
}



export async function deleteTicket(id, {TicketDeleteStatus }) {
    try {
        const [result] = await pool.query('UPDATE tbl_tickets SET ticketDeleteStatus =? WHERE ticketId = ?', [TicketDeleteStatus, id]);

        
        if (result.affectedRows > 0) {
           
            const updatedTicket = await getTicket(id);
            return updatedTicket;
        } else {
            
            return null;
        }
    } catch (error) {
        
        throw error;
    }
}










export async function getUserTickets(userId){
    const query = `SELECT * FROM tbl_tickets WHERE ticketStatus =0 OR ticketStatus=0 OR ticketStatusICT=0  AND userId = ?`; // Adjust the table and column names as needed
    const [tickets] = await pool.execute(query, [userId]);
    return tickets;
  };
export async function getAdminTickets(id){
    const query = `SELECT * FROM tbl_tickets WHERE userId = ?`; // Adjust the table and column names as needed
    const [tickets] = await pool.execute(query, [id]);
    return tickets;
  };
  export async function getAllTickets(){
    const query = `SELECT * FROM tbl_tickets`; // Adjust the table and column names as needed
    const [tickets] = await pool.execute(query);
    return tickets;
  };


//   export async function getTickets(){
//     const [rows] = await pool.query("select * from tbl_tickets WHERE ticketDeleteStatus != 1")
//     return rows
// }

export async function acceptTicket(id) {
    const ticketStatus = 1; // Accepted
    const ticketResoDate = new Date(); // Current date and time for resolution date


    try {
        const [result] = await pool.query(
            'UPDATE tbl_tickets SET ticketStatus = ?, ticketResoDate = ? WHERE ticketId = ?',
            [ticketStatus, ticketResoDate, id]
        );

        if (result.affectedRows > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}



export async function acceptTicketICT(id) {
    const ticketStatusICT = 1; // Accepted
    const ticketResoDate = new Date(); // Current date and time for resolution date


    try {
        const [result] = await pool.query(
            'UPDATE tbl_tickets SET ticketStatusICT = ?, ticketResoDate = ? WHERE ticketId = ?',
            [ticketStatusICT, ticketResoDate, id]
        );

        if (result.affectedRows > 0) {
            const updatedTicket = await getTicket(id); // Fetch the updated ticket
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}















// Function to decline a ticket
export async function declineTicket(id) {
    const ticketStatus = 0; // Not accepted
    const ticketResoDate = new Date(); // No resolution date for declined tickets

    try {
        const [result] = await pool.query(
            'UPDATE tbl_tickets SET ticketStatus = ?, ticketResoDate = ? WHERE ticketId = ?',
            [ticketStatus, ticketResoDate, id]
        );

        if (result.affectedRows > 0) {
            const updatedTicket = await getTicket(id);
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}


export async function declineTicketICT(id) {
    const ticketStatusICT = 0; // Not accepted
    const ticketResoDate = new Date(); // No resolution date for declined tickets

    try {
        const [result] = await pool.query(
            'UPDATE tbl_tickets SET ticketStatusICT = ?, ticketResoDate = ? WHERE ticketId = ?',
            [ticketStatusICT, ticketResoDate, id]
        );

        if (result.affectedRows > 0) {
            const updatedTicket = await getTicket(id);
            return updatedTicket;
        } else {
            return null; // Ticket not found or not updated
        }
    } catch (error) {
        throw error; // Handle error appropriately
    }
}





























export async function checkLoginStatus() {
    try {
      const response = await axios.get('http://localhost:8080/check-login', { withCredentials: true });
        
      return response.data; // Return the entire response containing loggedIn and role
     
    } catch (error) {
      console.error('Error checking login status:', error);
      return { loggedIn: false, role: null }; // Consider user as not logged in on error
    }
  }



  

  export async function checkUserRole() {
    try {
        const response = await axios.get('http://localhost:8080/check-role', { withCredentials: true });
        return response.data; // This will return { userId, role }
    } catch (error) {
        console.error('Error checking user role:', error);
        return { userId: null, role: null }; // Handle error case
    }
}
  

export async function makeAdmin(userId) {
    if (!userId) {
        throw new Error('Invalid userId');
    }

    // Assuming the role of '1' represents admin in your database
    const [result] = await pool.query(
        'UPDATE tbl_users SET role = 1 WHERE userId = ?',
        [userId]
    );

    if (result.affectedRows === 0) {
        throw new Error('User not found or already an admin');
    }

    return { message: 'User successfully promoted to admin' };
}

export async function makeUser(userId) {
    if (!userId) {
        throw new Error('Invalid userId');
    }

    // Assuming the role of '0' represents a regular user in your database
    const [result] = await pool.query(
        'UPDATE tbl_users SET role = 0 WHERE userId = ?',[userId]
    );

    if (result.affectedRows === 0) {
        throw new Error('User not found or already a regular user');
    }
    console.log(userId)

    return { message: 'User successfully demoted to regular user' };

}
