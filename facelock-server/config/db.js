const mongoose= require('mongoose');

const dbConnect= async()=>{
try{
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/facelock');
    console.log('Database connected successfully');
}
catch(err){
    console.error('Database connection error', err);
    process.exit(1); // Exit the process with failure
}
};

module.exports= dbConnect;