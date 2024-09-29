const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const DB = "mongodb+srv://prem1210:prem123@cluster0.cwsoi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const Eventinfo =require('./Events');
const userinfo =require('./User');
const Event_img =require('./Slider_img');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const connection =async()=>{
    mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit the process if unable to connect
    });
  
  mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err);
  });
  //  await mongoose.connect(DB).then(()=>{
  //     console.log("connection sucessful...");
  //   }).catch((e)=>{
  //     console.log("error",e);
    
  //   })
  }
  connection();
  

// Middleware to parse JSON bodies
app.use(express.json());  // Use this if you're using Express 4.16+


// Define the POST route

app.post('/api/Edit_user/:id', async (req, res) => {
    try {
        console.log(req.body);
        const { cheged_name, cheged_contact, value} = req.body;
        const id = req.params.id;
        console.log(id);
        console.log(cheged_name);
        console.log(cheged_contact);
        console.log(value);
        const user = await userinfo.findById(id);
        console.log(user);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }else{
            user.username = cheged_name;
            user.Contact = cheged_contact;
            user.dept = value;
            await user.save();
            res.json({ status: 'ok' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



app.post('/api/Event_register_conform/:id', async (req, res) => {
    const event_id = req.params.id;
    const confirm_members = req.body; // Assuming this is an array of participants
    
    try {
        // Fetch the event by ID
        const event = await Eventinfo.findById(event_id);
        
        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }

        
        // user.eventsOrg.push(updated._id);
        // await user.save();
        

        // Iterate over the confirm_members array
        confirm_members.forEach(member => {
            const { PRN, name, dept, contact, transction_id } = member;

            // Add to participants list
            event.participants.push({ PRN, name, dept, contact, transction_id });

            // Remove from pending participants if present
            event.pending_participants = event.pending_participants.filter((participant) => participant.PRN !== PRN);

          
        });

        // Save the updated event document
        await event.save();
        res.json({ status: 'ok' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



app.get('/api/envent/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const event = await Eventinfo.findById(id);
    if (!event) {
        return res.status(404).json({ status: 'error', message: 'Event not found' });
    }
    res.json({ status: 'ok', event });
});





app.post('/api/Event_register_pending', async (req, res) => {
    try {
        console.log(req.body);
        const { PRN, name, dept, contact, transction_id, event_id } = req.body;
        console.log(event_id);
        const event = await Eventinfo.findById(event_id);
        console.log(event);
        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }
        event.pending_participants.push({ PRN, name, dept, contact, transction_id });
        await event.save();

        const user = await userinfo.findOne({ PRN: PRN });
        user.eventpart.push(event_id);
        await user.save();
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



app.post('/users', async(req, res) => {
    console.log(req.body);
    const {name,password}=req.body;
    const PRN=name;
    const user= await userinfo.findOne({PRN})
    if(user){
        if(user.password===password){
            res.json({status:'ok',user:user});
        }
        else{
            res.json({status:'error',error:'Invalid password'});
        }
        // res.json({status:'ok',user:user});
    }
    else{
        res.json({status:'error',error:'user not found'});
    }
    
});
app.get('/chats/refress/:id', async(req, res) => {
    const id = req.params.id;
    console.log(id);
    const Newchats = await Eventinfo.findById(id);
    const chats = Newchats.messages;
    console.log(chats);

    res.json({ status: 'ok', chats });
   
});
app.post('/chat_add/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    console.log(req.body);

    try {
        const evnt = await Eventinfo.findById(id); // Await the result of findById
        if (!evnt) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }

        evnt.messages.push(req.body); // Assuming 'messages' is an array in your Eventinfo schema

        await evnt.save(); // Save the updated document

        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.post('/api/Newuser', async (req, res) => {
    try {
        console.log(req.body);
        const { PRN, password, name, Admin, mobileno, value } = req.body;

        // Check if user already exists
        const chech_new_user = await userinfo.findOne({ PRN });
        if (chech_new_user) {
            console.log('User already exists');
            return res.json({ status: 'error', message: 'User already exists' });
        }

        // Create new user
        const user = new userinfo({
            PRN,
            password,
            username: name,
            Admin,
            dept: value,
            Contact: mobileno,
        });

        // Save user to database
        await user.save();

        console.log('User created');
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.post('/api/Allenvent', async (req, res) => {
    const filters = req.body; // Assuming filters is an array of department names
    console.log('Received filters:', filters);

    try {
        let events;
        if (filters.length === 0) {
            // No filters, return all events in random order
            events = await Eventinfo.aggregate([{ $sample: { size: await Eventinfo.countDocuments() } }]).exec();
        } else {
            // Filter events based on the provided departments and return in random order
            events = await Eventinfo.aggregate([
                { $match: { dept: { $in: filters } } }, 
                { $sample: { size: await Eventinfo.countDocuments({ dept: { $in: filters } }) } } // Adjust size dynamically based on filter count
            ]).exec();
        }
        return res.json(events); // Return resolved JSON
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// const Eventinfo = require('./path/to/eventModel'); // Update the path as needed

app.post('/api/AddEvent', async (req, res) => {
    try {
        console.log(req.body);
        const { name, description, pyment_upi_id, date, time, Rules, backimg, Amount, organizer ,monthNames,dept} = req.body;

        // Validate input
        if (!name || !description || !pyment_upi_id || !date || !Amount || !organizer) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }

        // Create a new event object
        const newEvent = new Eventinfo({
            name: name,
            date: date,
            dept:dept, // Assuming 'IT dept' is the default or static value
            backimg: backimg,
            description: description,
            rules: Rules, // Ensure 'Rules' matches your schema (array of objects with 'rule' field)
            winner: '', // Optional field
            status: 'active',
            payment_upi_id: pyment_upi_id, // Fixed typo
            amount: Amount,
            time: time || '10:00-17:00', // Default time if not provided
            organizer: organizer,
            monthNames:monthNames,
            contact: 'default contact' // Optional or handle contact if necessary
        });

        // Save the event to the database
       const updated= await newEvent.save();
       console.log(updated._id);
        const user = await userinfo.findOne({ PRN: organizer });
        user.eventsOrg.push(updated._id);
        await user.save();
        
        res.json({ status: 'ok', message: 'Event created successfully' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.post('/api/UpdateEvent/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    console.log(req.body);
    try {
        const { name, description, pyment_upi_id, date, time, Rules, backimg, Amount, organizer, monthNames,dept,winner } = req.body;
        const event = await Eventinfo.findById(id);
        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }
        event.name = name;
        event.date = date;
        event.dept = dept;
        event.backimg = backimg;
        event.description = description;
        event.rules = Rules;
        event.payment_upi_id = pyment_upi_id;
        event.amount = Amount;
        event.time = time;
        event.organizer = organizer;
        event.monthNames = monthNames;
        event.winner=winner;
        await event.save();
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}
);

app.get('/api/Allusers', async (req, res) => {
    const users = await userinfo.find();
    console.log(users);
    res.json({users});
}
);
app.post('/api/Admin_setting', async (req, res) => {
    const conformAdmin = req.body;

    try {
        conformAdmin.forEach(async (admin) => {
            const { PRN } = admin;

            const user = await userinfo.findOne({ PRN });
            user.Admin = true;
            await user.save();
        }
        );
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any email service provider you want to use
    auth: {
      user: 'ezmanageevents@gmail.com', // your email
      pass: 'motm fpuy jpnm leey', // your email password
    },
  });

  app.post('/api/send_otp', async (req, res) => {
    try {
      const { email, otp } = req.body;
      console.log(`PRN: ${email}, OTP: ${otp}`);
  
      // Assuming you're looking up the user by PRN (which is part of the email)
      const user = await userinfo.findOne({ PRN: email });
  
      if (user) {
        // Mail options
        const mailOptions = {
          from: 'ezmanageevents@gmail.com', // Sender address
          to: `${email}@ritindia.edu`, // User's email from the frontend request
          subject: 'Your OTP for Password Reset', // Subject line
          text: `Hello ${user.PRN},\n\nYour OTP for password reset is: ${otp}\n\nPlease use this OTP within 1 minute.`, // Plain text body
        };
  
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ status: 'error', message: 'Error sending OTP email' });
          } else {
            console.log('Email sent: ' + info.response);
  
            return res.status(200).json({ status: 'ok', message: 'OTP sent successfully' });
          }
        });
      } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  });
  

  app.post('/api/reset_password', async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      // Find the user by PRN or email in your database
      const user = await userinfo.findOne({ PRN: email });
  
      if (user) {
        // Verify the OTP (you might need to store it temporarily in your DB or a cache)
        
          // Update the user's password in the database
          await userinfo.updateOne({ PRN: user.PRN }, { password: newPassword });
  
          return res.status(200).json({ status: 'ok', message: 'Password reset successfully' });
        
      } else {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
  });

  app.post('/api/add_slider_img', async (req, res) => {
    try {
      const { imgurl } = req.body;
  
      // Check if there is an existing document
      let eventImg = await Event_img.findOne();
      
      if (!eventImg) {
        // If no document exists, create a new one
        eventImg = new Event_img({ uri: [imgurl] });
      } else {
        // If document exists, push the new imgurl to the uri array
        eventImg.uri.push(imgurl);
      }
  
      // Save the event image document
      await eventImg.save();
  
      res.json({ status: 'ok', message: 'Image added successfully' });
    } catch (error) {
      console.error('Error adding image:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  app.get('/api/All_sliderimg', async (req, res) => {
    const eventImg = await Event_img.findOne();
    if (!eventImg) {
      return res.status(404).json({ status: 'error', message: 'No images found' });
    }
    res.json({ status: 'ok', images: eventImg.uri });
  });
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
