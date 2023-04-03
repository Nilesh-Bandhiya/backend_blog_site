const mongoose = require('mongoose')

const resetPasswordShecma = new mongoose.Schema({
    token: {
        type: String
    }
})

const ResetToken = mongoose.model("ResetToken", resetPasswordShecma)
module.exports = ResetToken