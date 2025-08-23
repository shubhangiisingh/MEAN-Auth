const express= require('express');
const mongoose = require('mongoose');
const cors= require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
const User= require('./models/User');

const app= express();
const PORT= 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(500).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
       const user= await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
       res.json({ token , user:{email:user.email} });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provieded, Authorization denied!' });
    try{
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
    }catch(error){
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
app.get('/api/profile', authenticateToken, async(req, res) => {
   try{
 const userId = req.user.userId;
 const user = await User.findById(userId).select('-password');
 if (!user) {
    return res.status(404).json({ error: 'User not found' });
 }
 return res.json(user);       
     
   }
   catch(error){
    console.error('Error fetching profile', error);
    res.status(500).json({ error: 'Internal server error' });
   }
});
