const router = require('express').Router();
const User = require("../models/User.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/register', async(req,res) => {
  
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt)
    req.body.password = hashPass 

    try{
    const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);

    } catch(err) {
        console.log(err);
    }
    
});


router.post('/login', async(req,res)=> {
    const {username, password} = req.body;
    const user = await User.findOne({username: username})
    if(user){
        const validity = await bcrypt.compare(password, user.password)
        if(!validity){
            res.status(400).json('Wrong Password!')
        }
        else{
            const {password, ...info} = user._doc
            const token = jwt.sign(
                {id: user._id, isAdmin: user.isAdmin},
                process.env.JWTKEY, 
                {expiresIn: '5d'}
            );
            res.status(201).json({...info, token})
        }
    }
    else{
        res.status(404).json('User Not Found');
    }
});

module.exports = router