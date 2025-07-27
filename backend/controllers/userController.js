const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        if(users.length === 0){
            return res.status(404).json({message: 'No users found'});
        }

        res.status(200).json({message: `${users.length} users found`, users});
    }catch(error){
        res.status(500).json({error: 'Could not fetch the users' ,details: error.message});
    }
}