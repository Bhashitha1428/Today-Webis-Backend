const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


//user schema

const UserSchema = mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    
    password: {
        type: String,
        required: true
    },
    role: { type: String },
    imageURL: { type: String },
    registerCourse:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
    }],

});

const User = module.exports = mongoose.model('user', UserSchema);

