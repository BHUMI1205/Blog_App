import mongoose from 'mongoose';

mongoose.connect('mongodb://0.0.0.0/Blogs');

const db = mongoose.connection;

db.on('connected', (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log("db is start on server");
})

export { db };