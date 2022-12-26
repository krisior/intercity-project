const User = require('../models/User')
const path = require('path')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc get all users
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => { 
    const users = await User.find().select('-_id username active').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    
    res.render('users.ejs', {
        usersList: users
    })
})

// @desc create new user
// @route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // confirm the data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPassword }

    // create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc update user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, active, password } = req.body
 
    if (!id || !username || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc delete user
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}