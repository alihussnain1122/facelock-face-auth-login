const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
    const { name, email, password, faceDescriptor } = req.body;
    try {

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            faceDescriptor
        });
        
        await user.save();
        
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const url = `http://localhost:5173/verify/${token}`;

        await sendEmail(user.email, 'Verify your email', `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb; text-align: center;">Welcome to FaceLock!</h2>
                <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
                </div>
                <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link: ${url}</p>
            </div>
        `);
        res.status(201).json({ message: 'Registered successfully, verify your email' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//Verfiy email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: 'User verified successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(400).send('Invalid or expired token');
    }
};

//Login
exports.Login= async(req,res)=>{
    const {email, password, faceDescriptor}= req.body;
    const euclideanDistance= (a,b)=>{
        return Math.sqrt(a.reduce((acc,val,i)=>acc+ ((val - b[i])**2),0));
    };
    try{
        if(!email|| !password ||!faceDescriptor){
            return res.status(400).json({message: 'Please fill all the fields'});
        }
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User does not exist'});
        }
        if(!user.isVerified){
            return res.status(400).json({message: 'User is not verified'});
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return  res.status(400).json({message: 'Invalid credentials'});
        }
        if(!user.faceDescriptor || user.faceDescriptor.length === 0){
            return res.status(400).json({message: 'No face data found for this user'});
        }
        const distance= euclideanDistance(user.faceDescriptor, faceDescriptor);
        if(distance> 0.6){
            return res.status(400).json({message: 'Face data does not match'});
        }
        const token= jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET, {expiresIn:'1h'});
        res.status(200).json({message: 'Login successful', token});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
}