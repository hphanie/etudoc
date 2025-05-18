const dotenv = require("dotenv")
dotenv.config();
const express = require("express");
const app = express();
const connectToDB = require('./src/api/config/database');
connectToDB()

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Bienvenue sur EtuDoc API');
});


const port = process.env.APP_PORT || 5000

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});





