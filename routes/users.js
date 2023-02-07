const router = require('express').Router();
const verify = require('../verifyToken');
const User = require("../models/User.js");
const bcrypt = require('bcrypt')

//Update a User
router.put("/:id", verify, async (req, res) => {
  if(req.user.id === req.params.id || req.user.isAdmin){
    if(req.body.password){
      const salt = await bcrypt.genSalt(10)
      const hashPass = await bcrypt.hash(req.body.password, salt)
      req.body.password = hashPass
    }
    try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
      res.status(201).json(updatedUser)
    } catch(err){
      res.status(500).json(err)
    }
  } else{
    res.status(403).json('You can only update your own account!')
  }
});

//Delete a Usser
router.delete('/:id', verify, async(req,res)=>{
  if(req.user.id === req.params.id || req.user.isAdmin){
    try{
      await User.findByIdAndDelete(req.params.id)
      res.status(201).json('User Deleted!')
    } catch(err){
      res.status(500),json(err)
    }
  } else{
    res.status(403).json('You can only delete your own account!')
  }
});


//Get a User
router.get('/find/:id', async(req,res)=>{
    try{
      const user = await User.findById(req.params.id)
      const {password,...info} = user._doc
      res.status(201).json(info)
    } catch(err){
      res.status(500),json(err)
    }
});


//Get all User
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if(req.user.isAdmin){
    try{
      const users = query? await User.find().sort({username:1}).limit(5) : await User.find();
      res.status(201).json(users)
    } catch(err){
      res.status(500).json(err)
    }
  } else{
    res.status(403).json('You are not allowed to see all users!')
  }
});


// Get stats
router.get('/stats', async(req,res)=>{
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1)
  const monthArray = [ 'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  try{
    const data = await User.aggregate([
      {
        $project:{
          month: {$month: '$createdAt'}
        },
      },
      {
        $group:{
          _id: '$month',
          total: {$sum: 1},
        }
      }
    ])
    res.status(201).json(data);
  } catch(err){
    console.log(err);
  }
});




module.exports = router