require('dotenv').config()
const express = require('express');
require('./db/conn')
const cookieParser = require('cookie-parser')

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use("/users", require("./routes/userRoutes"))

app.listen(port, () => {
    console.log(`blog-app listening on port ${port}`);
})