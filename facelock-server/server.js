const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');
const dbConnect= require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app=express();
dotenv.config();
dbConnect();

app.use(cors());
app.use(express.json());
//Routes
app.use('/api/auth', authRoutes);

const PORT= process.env.PORT || 5000;
app.listen(PORT, ()=>{
    try{
        console.log(`🚀Server is running on port ${PORT}`);
    }catch(error){
        console.error(`Error occurred: ${error.message}`);
    }
})
