const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId: {
        type: String
    }
},{versionKey: false})

module.exports = mongoose.model('group_user', schema)