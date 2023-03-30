require('dotenv').config()
const express = require('express');
require('./db/conn')
const cookieParser = require('cookie-parser')

const cors = require('cors');
const userRoutes = require("./routes/userRoutes")
const blogRoutes = require("./routes/blogRoutes")

const app = express();
const port = process.env.PORT || 5000;





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