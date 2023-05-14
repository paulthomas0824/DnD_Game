const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://paulthomas0824:Pc4ever!@cluster0.0eg5u5k.mongodb.net/myDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const user = new User({
        email: email,
        password: bcrypt.hashSync(password, 8) // Hash the password before saving it
    });

    try {
        await user.save();
        res.json({ message: 'User created successfully' });
    } catch (error) {
        res.json({ message: 'An error occurred' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ auth: false, token: null });
        }

        // If login is successful, create a token or a session
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.json({ message: 'An error occurred' });
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
