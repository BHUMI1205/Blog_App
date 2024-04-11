import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI); 
// mongoose.connect('mongodb://127.0.0.1/Blogs');

const db = mongoose.connection; 

db.on('connected', (err) => { 
    if (err) {
        console.log(err);
        return false;
    }
    console.log("db is start on server");
})

export { db };