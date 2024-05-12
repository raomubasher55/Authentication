require('dotenv').config();
const  mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/admin");
const express  = require('express');
const app = express();
app.use(express.json())
app.use(express.static('public'));

app.set('view engine' , 'ejs' );
app.set('views' , './views');

const userRoute = require('./routes/userRoute');
app.use('/api', userRoute)

const authRoute = require('./routes/authRoute');
app.use('/' , authRoute);


const port = process.env.SERVER_PORT | 3000;
// console.log(process.env.SERVER_PORT);
app.listen(port , ()=>{ 
    console.log("server is runing on port : " + port);
});