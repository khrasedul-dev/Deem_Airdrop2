const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    username: {
        type: String
    },
    ref_id: {
        type: String
    },
    ref_name: {
        type: String
    },
    ref_count:{
        type: Number
    },
    balance: {
        type: Number
    },
    wallet: {
        type: String
    },
    twitter: {
        type: String
    }
},{versionKey: false})

module.exports = mongoose.model('users',schema)