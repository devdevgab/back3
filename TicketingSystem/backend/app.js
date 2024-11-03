import express from 'express'
import {getUsers,getTickets, getAllTickets,createUser,login, createTicket,updateTicket,deleteTicket, getUserTickets, getAdminTickets, acceptTicket, declineTicket, checkLoginStatus, checkUserRole, getUser} from './database.js'
import bodyParser from 'body-parser'
import session from 'express-session';
import cors from 'cors';



// const express = require('express');
const app = express()

// app.use(cors());
app.use(bodyParser.json())

const corsOptions = {
    origin: 'http://localhost:3000', // Allow only your client origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies, etc.)
  };






app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: true, // Force session save on each request
    saveUninitialized: true, // Ensure a new session is saved even if unmodified
    cookie: { secure: false } // Set to true if using HTTPS
}));





app.get("/users", async (req, res)=>{
    const userId = req.session.userId; // Get userId from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const data = await getUsers()
    res.send(data)
})


// app.get("/tickets", async (req, res)=>{
//     const userId = req.session.userId; // Get userId from session

//     if (!userId) {
//         return res.status(401).json({ message: 'User not logged in' });
//     }

//     const data = await getTickets()
//     res.send(data)
// })

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
   
    const { FirstName, LastName, Username, Password, Email, Phone, Department } = req.body

    if (!FirstName || !LastName || !Username || !Password|| !Email || !Phone || !Department) {
        return res.status(400).send("data not supported");

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
    const { TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus } = req.body;
    const userId = req.session.userId; // Get userId from session
    
    if (!userId) {
        console.log('Ticket Login user:', userId);
        console.log('User IDDD stored in session:', req.session.userId);
        return res.status(401).json({ message: 'Ticket User not logged in' });
    }
  
    try {
        console.log('Ticket Login user:', userId);
        console.log('User IDDD stored in session:', req.session.userId);
      const ticket = await createTicket(userId, TicketTitle, TicketDesc, TicketServiceType, TicketServiceFor, TicketStatus, NumOfComputers, NumOfUsers, TicketDeleteStatus);
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
        req.session.save(); // Save session to store immediately
        console.log('User ID stored in session:', req.session.userId); // Check if it’s set after login
        res.json({ message: 'Login successful', user });
    }
      
      else {
          res.status(401).json({ message: 'Invalid username or password' });
      }
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
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
        res.status(500).json({ message: 'Internal server error' });
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

app.get("/check-role", (req, res) => {
    const userId = req.session.userId; // Get userId from session
    const role = req.session.role; // Get role from session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    res.json({ userId, role });
});










//function edit route
// app.put("/notes/:id", async (req, res) => {
//     const { id } = req.params;
//     const { title, content } = req.body;

//     if (!title && !content) {
//         return res.status(400).send("At least one field (title or content) is required for update");
//     }

//     try {
        
//         const updatedNoteData = await updateNote(id, { title, content });
//         res.status(200).send({ updatedNoteData });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// //function delete route

// app.delete("/notes/:id", async (req, res)=> {
//     const {id} = req.params;
//     try{
//         const deletedNoteData = await deleteNote(id);
//         res.status(200).send({deletedNoteData});

//     }catch(error){
//         console.error(error)
//         res.status(500).send("Internal server error")
//     }
// })

//error handling

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')

  })


  app.listen(8080, () => {
    console.log('running on 8080')
  })