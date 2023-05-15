const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://paulthomas0824:Pc4ever!@cluster0.0eg5u5k.mongodb.net/myDatabase?retryWrites=true&w=majority"; // This will come from your Heroku environment variables

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ error: 'No user with this email' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send({ error: 'Invalid password' });
    }

    res.status(200).send({ message: 'Login successful' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));