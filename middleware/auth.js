const jwt = require('jsonwebtoken')

const authorizeUser = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ msg: "User Not Authorized" })
    }

    try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         req.user = decoded.user;

         next();

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

module.exports = authorizeUser;