const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'mySecret', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.options('/signup', cors()); // Enable preflight request for the /signup endpoint

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://paulthomas0824.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'https://obscure-scrubland-76830.herokuapp.com'], // Replace with your actual front-end URLs
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb+srv://paulthomas0824:Pc4ever!@cluster0.0eg5u5k.mongodb.net/myDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

client.connect(err => {
  db = client.db("myDatabase");
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS  
    }
});

app.post('/signup', async (req, res) => {
    try {
        const users = db.collection('myCollection'); 

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = { email: req.body.email, password: hashedPassword };
        const result = await users.insertOne(user);

        let mailOptions = {
            from: 'paulwolfe0313@gmail.com',
            to: user.email,
            subject: 'Registration Confirmation',
            text: `Hello ${user.email},\n\nThank you for registering!`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Confirmation email sent: ' + info.response);
            }
        });

        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send('Error occurred');
        console.error(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const users = db.collection('myCollection');

        const user = await users.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send('Incorrect email or password');
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send('Incorrect email or password');
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.status(200).json({ token });

        req.session.userId = user._id;
    } catch (error) {
        res.status(500).send('Error occurred');
        console.error(error);
    }
});

app.get('/', (req, res) => {
    if (req.session.userId) {
      // The user is logged in
    } else {
      // The user is not logged in
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/'); 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
