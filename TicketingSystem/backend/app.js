import express from 'express'
import {getUsers,getTicket,makeAdmin,makeUser,declineTicketICT,acceptTicketICT, getAllTickets,createUser,login, createTicket,updateTicket,deleteTicket, getUserTickets, getAdminTickets, acceptTicket, declineTicket, checkLoginStatus, checkUserRole, getUser} from './database.js'
import bodyParser from 'body-parser'
import session from 'express-session';
import cors from 'cors';



// const express = require('express');
const app = express()

// app.use(cors());
app.use(bodyParser.json())

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3000', 'http://107.25.99.1:3000'];
        if (allowedOrigins.includes(origin) || !origin) {  // !origin allows requests like Postman or server-side
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};





app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: true, // Force session save on each request
    saveUninitialized: true, // Ensure a new session is saved even if unmodified
    cookie: { secure: false } // Set to true if using HTTPS
}));



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


 

app.get("/admin/tickets", async (req, res) =>{
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
app.get("/tickets", async (req, res) => {
    const userId = req.session.userId; // Get userId from session
    const role = req.session.role;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {

        if(role ==0 ){
            const tickets = await getUserTickets(userId); // Fetch only user's tickets
            console.log(role)
            res.json(tickets);
        }else{
            const tickets = await getAdminTickets(userId); 
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
    const { FirstName, LastName, Username, Password, Email, Phone, Department } = req.body

    if (!FirstName || !LastName || !Username || !Password|| !Email || !Phone || !Department) {
        return res.status(400).send("data not supported");

    }

    if(userRole !=2){
        return res.status(401).json({ message: 'User not admin error creating ' });
    }

    try{
    const users = await createUser(FirstName, LastName, Username, Password, Email, Phone, Department)
    res.status(201).send({users});
    }catch (error){
        console.error(error);
        res.status(500).send("internal server error")

    }
})


// axios.post('/create-ticket', data, { withCredentials: true }); // Axios example
app.post('/create-ticket', async (req, res) => {
    const { TicketTitle, TicketDesc,TicketDepartment, TicketServiceType, TicketServiceFor, TicketRequestedBy, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus } = req.body;
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
      const ticket = await createTicket(userId, TicketDepartment, TicketTitle, TicketRequestedBy, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus);
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
      res.json({ userFirstName: req.session.userFirstName });
    } else {
      res.status(401).json({ message: 'User not logged in' });
    }
  });












//Login Function

app.post("/login", async (req, res) => {
  const { Username, Password } = req.body;

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
        req.session.save(); // Save session to store immediately
        console.log('User ID stored in session:', req.session.userId, 'First Name: ', req.session.userFirstName); // Check if it’s set after login
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
app.put("/accept-ticket/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await acceptTicket(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket accepted successfully', ticket: updatedTicket });
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});


app.put("/accept-ticketICT/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await acceptTicketICT(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket accepted successfully', ticket: updatedTicket });
        } else {
            res.status(404).json({ message: 'Ticket not found or already accepted' });
        }
    } catch (error) {
        console.error('Error accepting ticket:', error);
        // Return a more descriptive error response
        res.status(500).json({ message: 'Error accepting ticket', error: error.message });
    }
});
























// Decline a ticket
app.put("/decline-ticket/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await declineTicket(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket declined successfully', ticket: updatedTicket });
        } else {
            res.status(404).json({ message: 'Ticket not found or already declined' });
        }
    } catch (error) {
        console.error('Error declining ticket:', error);
        res.status(500).json({ message: 'Error declining ticket' });
    }
});


app.put("/decline-ticketICT/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const updatedTicket = await declineTicketICT(id);
        if (updatedTicket) {
            res.status(200).json({ message: 'Ticket declined successfully', ticket: updatedTicket });
        } else {
            res.status(404).json({ message: 'Ticket not found or already declined' });
        }
    } catch (error) {
        console.error('Error declining ticket:', error);
        res.status(500).json({ message: 'Error declining ticket' });
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
        const result = await makeUser(userIdToDemote);  // Call the function to demote user to regular user
        console.log("user to demote:", userIdToDemote)
        console.log("user id in app.js", sessionUser)
        
        return res.status(200).json(result);  // Send success message
    } catch (error) {
        console.error('Error demoting user to regular:', error);
        return res.status(500).json({ message: 'Internal server error' });  // Handle errors
    }
});









app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')

  })


  app.listen(8080, () => {
    console.log('running on 8080')
  })
