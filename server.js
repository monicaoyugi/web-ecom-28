const express = require("express");
require('dotenv').config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,useUnifiedTopology: true , useCreateIndex: true})
.then(()=> console.log("Connected to the database..."))
.catch(err => console.log(err));

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const productsRouter = require('./app/routes/products');
app.use('/products', productsRouter);
const PORT = process.env.PORT | 4000;
const hostname = '127.0.0.1';


app.get("/", (req, res) => {
    res.send('Our front end home page goes here...');
});
app.listen(PORT, () => {
    console.log(`Listening at ${hostname}:${PORT}`);
})
module.exports = {PORT, hostname};
