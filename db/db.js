const mongoose = require('mongoose') ;
const dotenv = require('dotenv') ;


dotenv.config();

const username = "MongoDB";
const password = "Web2023";

const connection = ()=>{
    const MONGODB_URI = `mongodb+srv://${username}:${password}@cluster0.dspb29q.mongodb.net/?retryWrites=true&w=majority`
    mongoose.set('strictQuery', true);
    mongoose.connect(MONGODB_URI,{useNewUrlParser: true});
    mongoose.connection.on('connected', ()=>{
        console.log('Data base connected successfully')
    });

    mongoose.connection.on('disconnected', ()=>{
        console.log('Data base disconnected');
    });

}

module.exports= connection;