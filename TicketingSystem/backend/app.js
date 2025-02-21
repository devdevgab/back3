import express from 'express'
import {getUsers,getTicket,makeAdmin,getUserDetails,uploadRemarks,plsTicket, inProgressTicket,getATickets,getLogs,getTicketResolvedAdmin, logEntry, getTicketResolved,openTicket, closeTicket, getAcceptedTickets, makeUser,declineTicketICT,acceptTicketICT,getBranchTickets,fetchBranches,getAllTickets,createUser,login, createTicket,updateTicket,deleteTicket, getUserTickets, getAdminTickets, acceptTicket, declineTicket, checkLoginStatus, checkUserRole, getUser} from './database.js'
import bodyParser from 'body-parser'
import session from 'express-session';
import cors from 'cors';



//WHOEVER TAKES OVER THIS CODE PLEASE MAKE SURE TO CHANGE THE IP ADDRESS TO THE SERVER IP ADDRESS THIS CAN BE DONE ON THE LEFT
//SIDE OF VS CODE, BY CLICK THE SEARCH BUTTON AND CHOOSING REPLACE

//BEFORE PROCEEDING TO EDIT THE CODE BELOW PLEASE READ THE DOCUMENTATION ON THE BACKEND FOLDER, I PLACED A README FILE THERE


//I DONT KNOW HOW I WROTE THIS CODE BUT IT WORKS JUST FOLLOW THE PROPER BACKEND API CALLS AND YOU SHOULD BE FINE

// const express = require('express');
const app = express()

// app.use(cors());
app.use(bodyParser.json())

// const corsOptions = {
//     origin: (origin, callback) => {
//         const allowedOrigins = ['http://localhost:3000', 'http://107.25.99.1:3000'];
//         if (allowedOrigins.includes(origin) || !origin) {  // !origin allows requests like Postman or server-side
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// };
// const corsOptions = {
//     origin:(origin, callback ) => {
//         if(origin){
//             callback(null, origin);
//         }
//         else{
//             callback(null,true);
//         }

//     },

    
    
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type','Authorization'],
//     credentials: true
// };

const corsOptions = {
    origin: "http://192.168.10.245:3000", // Allow your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Critical: Allows cookies to be sent
  };
  app.use(cors(corsOptions));





app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(
    session({
      secret: "your_secret_key",
      resave: false, // Avoid unnecessary session saves
      saveUninitialized: false, // Prevent empty sessions from being created
      cookie: {
        secure: false, // Set `true` if using HTTPS
        httpOnly: true, // Prevent client-side access
        sameSite: "Lax", // Required for cross-origin cookies
      },
    })
  );


app.get("/admin-all-users", async (req, res)=>{
    const userId = req.session.userId;
    const userRole = req.session.role; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    if(userRole !=2 ){
        return res.status(401).json({ message: 'User not admin' });
    }
    

    
    
        
    const data = await getUsers()
    
    const logDesc = "User ID Accessed Admin command to list all users: " + req.session.userId + " "+ req.session.userFirstName + " with role: "+ req.session.role;
    const logUser = req.session.userId;

    const log = await logEntry(logUser, logDesc);

    res.send(data)
})

app.get("/users", async (req, res)=>{
    const userId = req.session.userId;
    const userRole = req.session.role; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    

    const data = await getUsers()
    res.send(data)
})


app.get("/logs", async (req, res) => {
    const role = req.session.userFirstName;
    const userId = req.session.userId; // Get userId from session
    const userRole = req.session.role; // Get userId from session
    console.log(userRole)
    if (!userId) {
        console.log('Ticket Login log user:', userId);
        return res.status(401).json({ message: 'User not logged in' });
    }else{
        console.log("success log id: " + userId + " and user role: "+ req.session.role) 
    }


  
    if(userRole !=2 ){

        return res.status(401).json({ message: 'User not admin' });
    }

    try {
        const logs = await getLogs(); // Fetch latest logs from database
        res.json(logs);
        
      } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Internal server error" });
      }

})

app.get("/admin/tickets", async (req, res) =>{
    const userId = req.session.userId; // Get userId from session
    const role = req.session.role;
    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    if(role !=2){
        return res.status(401).json({ message: 'User not admin' });
    }
    try {
        const tickets = await getAllTickets(userId); 
        console.log(role)



        const logDesc = "User ID Accessed Admin Tickets command to get all tickets " + req.session.userId + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);









        res.json(tickets);
        
        
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }

    

})
app.get("/tickets/accepted", async (req, res) =>{
    const userId = req.session.userId; // Get userId from session
    const role = req.session.role;
    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    if(role !=2){
        return res.status(401).json({ message: 'User not admin' });
    }
    try {
        const tickets = await getAcceptedTickets(userId); // Fetch only user's tickets
        console.log(role)

        const logDesc = "User ID Accessed Admin command to list all Accepted Tickets by BM and ICT: " + req.session.userId + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);

        res.json(tickets);
        
        
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }

    
})

app.get("/tickets/getTicketsResolves", async (req, res) => {
    const userId = req.session.userId;
    const role = req.session.role;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        let tickets;
        if (role == 2) {
            tickets = await getTicketResolvedAdmin();
            const logDesc = "User ID Accessed Admin command to list all Open and Closed Tickets: " + req.session.userId + " "+ req.session.userFirstName + " with role: "+ req.session.role;
            const logUser = req.session.userId;

            const log = await logEntry(logUser, logDesc);
            

        } else {
            tickets = await getTicketResolved(userId);
        }

        console.log("Tickets fetched successfully:", tickets);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }
});
// app.get("/tickets/getTicketsResolvesAdmin", async (req, res) => {
//     const userId = req.session.userId; // Get userId from session
//     const role = req.session.role;

//     if(!userId){
//         return res.status(401).json({ message: 'User not logged in' });

//     }
//     try{
//         const tickets = await getTicketResolvedAdmin();
//         console.log(role)
//         res.json(tickets);
//     }catch(error){
//         console.error('Error fetching tickets:', error);
//         console.log("Received userId:", userId, "Type:", typeof userId);

//         res.status(500).json({ message: 'Error fetching tickets', tickets });
//     }
// })

//Function disabled for now getting errors

app.get("/tickets/:id", async (req, res) => {
    const userId = req.session.userId; // Get userId from session
    const { id } = req.params; // Get the ticket ID from the URL parameters

    if (!userId) {
        return res.status(401).json({ message: 'User  not logged in' });
    }

    try {
        const ticket = await getTicket(id); // Use the getTicket function to fetch the ticket by ID
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: 'Error fetching ticket' });
    }
}); 

app.get("/Atickets", async (req, res) => {
   


    try {

            const tickets = await getATickets(); 


            res.json(tickets);
        
        
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }


});

app.get("/tickets", async (req, res) => {
    const userId = req.session.userId; // Get userId from session
    const role = req.session.role;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {

        if(role ==0 || role =="" ){
            const tickets = await getUserTickets(userId); // Fetch only user's tickets
            console.log(role)
            res.json(tickets);
        }else{
            const tickets = await getAdminTickets(userId); 

            const logDesc = "User ID Accessed Admin command to list all User Tickets: " + req.session.userId + " "+ req.session.userFirstName + " with role: "+ req.session.role;
            const logUser = req.session.userId;

            const log = await logEntry(logUser, logDesc);
            console.log(role)
            res.json(tickets);
        }
        
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }


});

app.get('/check-login', (req, res) => {
    if (req.session.userId) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  });



app.post("/create", async (req, res)=>{
    const userRole = req.session.role;
    const { FirstName, LastName, Username, Password, Email, Phone,BranchCode, Department } = req.body

    if (!FirstName || !LastName || !Username || !Password|| !Email || !Phone || !BranchCode || !Department) {
        return res.status(400).send("data not supported");

    }

    if(userRole !=2){
        return res.status(401).json({ message: 'User not admin error creating ' });
    }

    try{
    const users = await createUser(FirstName, LastName, Username, Password, Email, Phone, BranchCode, Department)
    const logDesc = "User ID Accessed Admin command to create new user: " + req.session.userId + " "+ req.session.userFirstName + " with role: "+ req.session.role;
    const logUser = req.session.userId;

    const log = await logEntry(logUser, logDesc);
    res.status(201).send({users});
    }catch (error){
        console.error(error);
        res.status(500).send("internal server error")

    }
})


// axios.post('/create-ticket', data, { withCredentials: true }); // Axios example
app.post('/create-ticket', async (req, res) => {
    const { 
        TicketTitle, 
        TicketDesc, 
        BranchCode, 
        TicketDepartment, 
        TicketServiceType, 
        TicketServiceFor, 
        TicketRequestedBy, 
        TicketStatus = '1',  // Default status if not provided
        NumOfComputers = '0', 
        NumOfUsers = '0', 
        TicketDeleteStatus = '0' 
    } = req.body;
    const userId = req.session.userId; // Get userId from session
    const userFirstName = req.session.userFirstName;
    const userLastName = req.session.userLastName;
    
    if (!userId) {
        console.log('Ticket Login user:', userId);
        console.log('User IDDD stored in session:', req.session.userId);
        return res.status(401).json({ message: 'Ticket User not logged in' });
    }
    
  
    try {
        console.log('Ticket Login user:', userId);
        console.log('User IDDD stored in session:', req.session.userId);

        if (!TicketDepartment || !BranchCode || !TicketTitle || !TicketRequestedBy || !TicketDesc || !TicketServiceType || !TicketServiceFor || !NumOfComputers || !NumOfUsers ) {
        
            return res.status(402).json({message: "Fields are empty"});
        }
      const ticket = await createTicket(userId, TicketDepartment, BranchCode, TicketTitle, TicketRequestedBy, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus);
      
      
      res.status(201).json({ message: 'Ticket created successfully', ticket });
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ message: 'Error creating ticket' });
    }
  });





app.put("/update-ticket/:id", async (req, res) => {
    const userId = req.session.userId; // Get userId from session

    const { id } = req.params;
    const { TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }



    if (!TicketTitle || !TicketDesc || !TicketServiceType || !TicketServiceFor|| !TicketStatus ) {
        return res.status(400).send("data not supported");

    }

    try {
        
        const updatedTicketData = await updateTicket(id, { TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus });
        res.status(200).send({ updatedTicketData });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/ticket/remarks/:id", async (req, res) => {
    const userId = req.session.userId; // Get userId from session
    const { id } = req.params;
    const { TicketRemarks } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    if (!TicketRemarks) {
        return res.status(400).json({ message: "Remarks cannot be empty" });
    }

    try {
        const updatedTicketData = await uploadRemarks(id, TicketRemarks); // Pass TicketRemarks correctly
        if (updatedTicketData) {
            res.status(200).json({ message: "Remarks updated successfully", updatedTicketData });
        } else {
            res.status(404).json({ message: "Ticket not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


app.put("/delete-ticket/:id", async (req, res) => {


    
    const { id } = req.params;
    const { TicketDeleteStatus } = req.body;
    const userId = req.session.userId; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    if (!TicketDeleteStatus ) {
        return res.status(400).send("data not supported");

    }

    try {
        
        const updatedTicketData = await deleteTicket(id, { TicketDeleteStatus });
        res.status(200).send({ TicketDeleteStatus });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.get("/get-session", (req, res) => {
    // Send the session data, e.g., user first name
    if (req.session.userFirstName) {
      res.json({ 
        userFirstName: req.session.userFirstName, 
        userDepartment: req.session.userDepartment 
    });
    } else {
      res.status(401).json({ message: 'User not logged in' });
    }
  });












//Login Function

app.post("/login", async (req, res) => {
  const { Username, Password } = req.body;

  if (Username == ""|| Password == ""){
    return res.status(400).json({message: "Fields Required are empty"})
  }
  if (!Username || !Password) {
      return res.status(400).json({ message: 'Invalid username or password' });
  }

  try {
      
      const user = await login(Username, Password);
      console.log('Login query result:', user); // Debugging output
      console.log('Session after login:', req.session);

      if (user) {

        req.session.userId = user.userId; // Store userId in session
        req.session.role = user.role;
        req.session.userFirstName = user.userFirstName;
        req.session.userLastName = user.userLastName;
        req.session.userDepartment = user.department;
        req.session.save(); // Save session to store immediately

        
        const logDesc = "User logged in ID: " + req.session.userId + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;
        const log = await logEntry(logUser, logDesc);
        console.log('User ID stored in session:', logUser, 'First Name: ', req.session.userFirstName, 'Last Name: ', req.session.userLastName); // Check if it’s set after login
        
        res.json({ message: 'Login successful', user });
    }
      
      else {
          res.status(401).json({ message: 'Invalid username or password' });
      }
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server Error: Server might be offline!' });
  }
});


app.post("/logout", async (req, res) => {
    try{
        
        if(req.session.id){
            
            const logDesc = "User ID Logged out:  " + req.session.userId; + " "+ req.session.userFirstName + " with role: "+ req.session.role;
            const logUser = req.session.userId;

            const log = await logEntry(logUser, logDesc);
            req.session.destroy(function(err){
                console.log("session destroyed")
                res.json({ message: 'Logout successful' });
                

                
            })
        }
    }catch(error){
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server Error: Server might be offline!' });
    }
    
  });




  app.get('/check-login', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});
// Accept a ticket
app.put("/accept-ticket/:id/:name", async (req, res) => {
    const { id } = req.params;
    const name = req.session.userFirstName + " "+ req.session.userLastName;
    const userId = req.session.userId; // Get userId from session


    const firstName = req.session.userFirstName;
    const lastName = req.session.userLastName;


    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await acceptTicket(name, id);
        if (updatedTicket) {
            console.log(req.session.userFirstName + " "+ req.session.userLastName);
            res.status(200).json({ message: 'Ticket accepted successfully', ticket: updatedTicket, ticketAuthor: {firstName: firstName, lastName: lastName}, });
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // console.log(req.session.user.userFirstName);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});


app.put("/accept-ticketICT/:id/:name", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session
    const name = req.session.userFirstName + " "+ req.session.userLastName;
    const firstName = req.session.userFirstName;
    const lastName = req.session.userLastName;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await acceptTicketICT(name, id);
        if (updatedTicket) {
            const logDesc = "User ID " + req.session.userId +" Accessed Admin command to accept ICT Ticket Side, ticket ID: "+id + " "+ req.session.userFirstName + " with role: "+ req.session.role;
            const logUser = req.session.userId;

            const log = await logEntry(logUser, logDesc);
            res.status(200).json({ message: 'Ticket accepted successfully', ticket: updatedTicket, ticketAuthor: {firstName: firstName, lastName: lastName}, });
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});

app.put("/decline-ticketICT/:id/:name", async (req, res) => {
    const { id } = req.params;
    const name = req.session.userFirstName + " "+ req.session.userLastName;
    const userId = req.session.userId; // Get userId from session
    
    const firstName = req.session.userFirstName;
    const lastName = req.session.userLastName;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await declineTicketICT(name, id);
        if (updatedTicket) {
            const logDesc = "User ID " + req.session.userId +" Accessed Admin command to decline ICT Ticket Side, ticket ID: "+id + " "+ req.session.userFirstName + " with role: "+ req.session.role;
            const logUser = req.session.userId;

            const log = await logEntry(logUser, logDesc);
            res.status(200).json({ message: 'Ticket declined successfully', ticket: updatedTicket, ticketAuthor: {firstName: firstName, lastName: lastName}, });
        } else {    
            res.status(404).json({ message: 'Ticket not found or already declined' });
        }
    } catch (error) {
        console.error('Error declining ticket:', error);
        res.status(500).json({ message: 'Error declining ticket' });
    }
});


// Decline a ticket
app.put("/decline-ticket/:id/:name", async (req, res) => {
    const { id } = req.params;
    const name = req.session.userFirstName + " "+ req.session.userLastName;
    const userId = req.session.userId; // Get userId from session
    const firstName = req.session.userFirstName;
    const lastName = req.session.userLastName;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await declineTicket(name, id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket declined successfully', ticket: updatedTicket, ticketAuthor: {firstName: firstName, lastName: lastName}, });
        } else {
            res.status(404).json({ message: 'Ticket not found or already declined' });
        }
    } catch (error) {
        console.error('Error declining ticket:', error);
        res.status(500).json({ message: 'Error declining ticket' });
    }
});



app.post("/ticket-verdict-show-author/:name/:id", async (req, res) => {
    const userId = req.session.userId;
    const { id: ticketId } = req.params; // Destructure `id` as `ticketId`
    const name = `${req.session.userFirstName} ${req.session.userLastName}`; // Combine session data for the name

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        // Call authorAccepted with `name` and `ticketId`
        const updatedVerdict = await authorAccepted(name, ticketId);
        if (updatedVerdict) {
            res.status(200).json({ message: 'Ticket Verdict Accepted' });
        } else {
            res.status(400).json({ message: 'Error Verdict' });
        }
    } catch (error) {
        console.log('Error accepting ticket', error);
        res.status(500).json({ message: 'Error Accepting Ticket', error: error.message });
    }
});




app.get('/api/print/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    try {
      // Retrieve or generate the document (e.g., a PDF) for the ticket
      const filePath = `/path/to/documents/ticket_${ticketId}.pdf`;
  
      res.download(filePath, `ticket_${ticketId}.pdf`, (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
          res.status(500).send('Error printing the document.');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Failed to process the print request.');
    }
  });
  
  app.get('/print', async (req, res) => {
    const { ticketId } = req.query;
  
    if (!ticketId) {
      return res.status(400).json({ error: 'Ticket ID is required' });
    }
  
    try {
      // Fetch ticket details from the database based on ticketId
      const ticket = await database.getTicketById(ticketId); // Example function
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
  
      // Implement your printing logic here
      // This could involve sending the ticket to a printer or preparing a PDF
      const printResult = await somePrintService(ticket); // Replace with actual logic
  
      // Send success response
      res.json({ success: true, message: 'Print job submitted', printResult });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the print request' });
    }
  });
  












//Designation Ticket add
//Edit ticket same ID return sender name 











app.get("/check-role", (req, res) => {
    const userId = req.session.userId; // Get userId from session
    const role = req.session.role; // Get role from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    res.json({ userId, role });
});



app.put('/make-admin/:id', async (req, res) => {
    const userId = req.session.userId;  // Get logged-in userId from session
    const role = req.session.role;  // Get logged-in user role from session
    const sessionUser = req.session.userId;

    if (!sessionUser ) {
        console.log(userId)
        return res.status(403).json({ message: 'user not verified to be in the session' });
        
    }
    if (role !==2) {
        console.log(role)
        return res.status(403).json({ message: 'Forbidden: Only admins can promote users' });
    }

    const userIdToPromote = req.params.id;  // Get the userId from the URL parameter

    if (!userIdToPromote) {
        return res.status(400).json({ message: 'Invalid userId' });  // Make sure the userId is provided
    }

    try {
        const logDesc = "User ID :" + req.session.userId+ " Accessed Admin command to promote another user: "+userIdToPromote  + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);
        console.log("user promote to admin: ", userIdToPromote)
        const result = await makeAdmin(userIdToPromote);  // Call the function to promote user to admin
        return res.status(200).json(result);  // Send success message
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        return res.status(500).json({ message: 'Internal server error' });  // Handle errors
    }
});

app.put('/make-user/:id', async (req, res) => {
    const userId = req.session.userId;  // Get logged-in userId from session
    const role = req.session.role;  // Get logged-in user role from session
    const sessionUser = req.session.userId;
    if (!sessionUser ) {
        return res.status(403).json({ message: 'user not verified to be in the session' });
    }
    


    const userIdToDemote = req.params.id;  // Get the userId from the URL parameter

    if (!userIdToDemote) {
        return res.status(400).json({ message: 'Invalid userId' });  // Make sure the userId is provided
    }

    try {
        const logDesc = "User ID :" + req.session.userId+ " Accessed Admin command to demote another user: "+userIdToDemote  + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);
        
        
        const result = await makeUser(userIdToDemote);  // Call the function to demote user to regular user
        console.log("user to demote:", userIdToDemote)
        console.log("user id in app.js", sessionUser)
        
        return res.status(200).json(result);  // Send success message
    } catch (error) {
        console.error('Error demoting user to regular:', error);
        return res.status(500).json({ message: 'Internal server error' });  // Handle errors
    }
});

app.get('/get-branches', async (req, res) => {
    try {
      const branches = await fetchBranches();
      
      res.status(200).json(branches);
    } catch (err) {
      console.error('Error fetching branches:', err);
      res.status(500).json({ message: 'Error fetching branches.' });
    }
  });

  app.get('/branch/tickets', async (req, res) => {
    const userId = req.session.userId; // Assuming you have userId from session or token
    const { branchCode } = req.query; // Extract branchCode from query parameters

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    if (!branchCode) {
        return res.status(400).json({ message: 'Branch code is required' });
    }

    try {

        const branchticket = await getBranchTickets(branchCode);
        res.status(200).json(branchticket);
    } catch (err) {
        console.error('Error fetching branch tickets:', err);
        res.status(500).json({ message: 'Error fetching branch tickets.' });
    }
});


app.get('/user/details', async (req, res) => {
    const userId = req.session.userId; // Assuming you have userId from session or token

    try {
        const user = await getUserDetails(userId); // Implement this function to fetch user details from the database
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ message: 'Error fetching user details.' });
    }
});


// app.get('/tickets/accepted', async (req, res) => {
//     const userId = req.session.userId; // Assuming you have userId from session or token
//     const role = req.session.role;

//     if(!userId){
//         return res.status(401).json({ message: 'User not logged in' });
//     }   
//     try {
//         const tickets = await getAllTickets();
//         const acceptedTickets = tickets.filter(ticket => ticket.TicketStatus === '2');
//         res.status(200).json(acceptedTickets);        
//     }
//     catch (err) {
//         console.error('Error fetching accepted tickets:', err);
//         res.status(500).json({ message: 'Error fetching accepted tickets.' });
//     }

// });
app.get("/tickets/accepted", async (req, res) =>{
    const userId = req.session.userId; // Get userId from session
    const role = req.session.role;
    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    try {
        const tickets = await getAllTickets(userId); // Fetch only user's tickets
        console.log(role)
        res.json(tickets);
        
        
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }

    
})


app.put("/mark-in-progress/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session
    
    

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {

        const logDesc = "User ID :" + req.session.userId+ " Accessed Admin command to mark ticket as in progress: "+id  + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);
        
        const updatedTicket = await inProgressTicket(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket moved to in progress successfully'});
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});




app.put("/mark-open/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session
    
    

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {

        const logDesc = "User ID :" + req.session.userId+ " Accessed Admin command to mark ticket as open: "+id  + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);
        
        const updatedTicket = await openTicket(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket open successfully'});
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});

app.put("/mark-pls/:id", async (req,res) =>{
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {

        const logDesc = "User ID :" + req.session.userId+ " Accessed Admin command to mark ticket as sent to pls: "+id  + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);
        
        const updatedTicket = await plsTicket(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket pls successfully'});
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});
app.put("/mark-closed/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session
    
    

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const logDesc = "User ID :" + req.session.userId+ " Accessed Admin command to mark ticket closed: "+id  + " "+ req.session.userFirstName + " with role: "+ req.session.role;
        const logUser = req.session.userId;

        const log = await logEntry(logUser, logDesc);
        const updatedTicket = await closeTicket(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket accepted successfully'});
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});
// app.put ("/log-entry/:id", async (req, res) => {


// });











// app.get('/tickets/accepted', async (req, res) => {
//     try {
//         const tickets = await getAllTickets();
//         res.status(200).json(tickets); // Send the filtered tickets as a response
//     } catch (error) {
//         console.error('Error fetching tickets:', error.message);
//         res.status(500).json({ message: 'Error fetching tickets.' });
//     }
// });

// app.get("tickets/accepted", async (req, res) =>{
//     const userId = req.session.userId; // Get userId from session
//     const role = req.session.role;
//     if (!userId) {
//         return res.status(401).json({ message: 'User not logged in' });
//     }
//     try {
//         const tickets = await getAcceptedTickets(userId); // Fetch only user's tickets
//         console.log(role)
//         res.json(tickets);
        
        
//     } catch (error) {
//         console.error('Error fetching tickets:', error);
//         res.status(500).json({ message: 'Error fetching tickets' });
//     }

    
// })


// app.get("/tickets/accepted", async (req, res) =>{
//     const userId = req.session.userId; // Get userId from session
//     const role = req.session.role;
//     if (!userId) {
//         return res.status(401).json({ message: 'User not logged in' });
//     }
//     try {
//         const tickets = await getAllTickets(userId); // Fetch only user's tickets
//         console.log(role)
//         res.json(tickets);
        
        
//     } catch (error) {
//         console.error('Error fetching tickets:', error);
//         res.status(500).json({ message: 'Error fetching ticketss' });
//     }

    




// })

// app.get("/admin/tickets", async (req, res) =>{
//     const userId = req.session.userId; // Get userId from session
//     const role = req.session.role;
//     if (!userId) {
//         return res.status(401).json({ message: 'User not logged in' });
//     }
//     try {
//         const tickets = await getAllTickets(userId); // Fetch only user's tickets
//         console.log(role)
//         res.json(tickets);
        
        
//     } catch (error) {
//         console.error('Error fetching tickets:', error);
//         res.status(500).json({ message: 'Error fetching tickets' });
//     }

    




// })






// app.get("/tickets", async (req, res) => {
//     const userId = req.session.userId; // Get userId from session
//     const role = req.session.role;

//     if (!userId) {
//         return res.status(401).json({ message: 'User not logged in' });
//     }

//     try {

//         if(role ==0 ){
//             const tickets = await getUserTickets(userId); // Fetch only user's tickets
//             console.log(role)
//             res.json(tickets);
//         }else{
//             const tickets = await getAdminTickets(userId); 
//             console.log(role)
//             res.json(tickets);
//         }
        
//     } catch (error) {
//         console.error('Error fetching tickets:', error);
//         res.status(500).json({ message: 'Error fetching tickets' });
//     }


// });





app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')

  })


  const ip = '192.168.10.245';
  const port = '8080';
  app.listen(port, ip, () => {
    console.log('running on 8080')
  })
