const router = require('express').Router();
const dotenv = require('dotenv') //saves secrets like passwords, API keys etc in a virtual env
const bcrypt = require('bcryptjs/dist/bcrypt'); //encrypting the password
const User = require('../models/User');

const jwt = require('jsonwebtoken') //for jwt webtoken to check if user is logged in 

//validations are added to this file using the holi/joi library
const {registerValidation, loginValidation} = require('../validation')

dotenv.config()

router.post('/register', async (req, res) => {

    //validate before making a user
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //check if email is already in the database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send("Email already exists")

    //Hash password
    const saltRounds = 10
    const hashpassword = await bcrypt.hashSync(req.body.password, saltRounds)

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashpassword
    })
    try{
        const saveUser = await user.save()
        res.send({user: user._id})
    }catch(err){
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    //validate before loggin in
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //check if user already exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email is wrong')

    //comparing passwords
    const validPass = await bcrypt.compareSync(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid password')

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)
    res.header('auth-token', token).send(token)

    // return res.status(200).send('Logged In')
})

module.exports = router