require('dotenv').config()
const express = require('express');
require('./db/conn')
const cookieParser = require('cookie-parser')
const multer = require('multer');

const cors = require('cors');
const userRoutes = require("./routes/userRoutes")
const blogRoutes = require("./routes/blogRoutes")

const app = express();
const port = process.env.PORT || 5000;


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error('Please Upload image Jpg|Jpeg|Png'))
    }
    cb(null, true);
}


app.use(cors());
app.use(express.json())
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use("/users", userRoutes)
app.use("/blogs", blogRoutes)

app.listen(port, () => {
    console.log(`blog-app listening on port ${port}`);
})