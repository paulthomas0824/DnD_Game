const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'ongodb+srv://paulthomas0824:Pc4ever!@cluster0.0eg5u5k.mongodb.net/myDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
  const {email, password} = req.body;

  const user = new User({email, password});
  await user.save();

  res.sendStatus(201);
});

app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email, password});
  if (!user) {
    return res.sendStatus(401);
  }

  res.sendStatus(200);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
