const router = require('express').Router();
const verify = require('../verifyToken');
const List = require("../models/List.js");

//Create
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body)
        try {
            const savedList = await newList.save();
            res.status(201).json(savedList)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You are not allowed to add movies!')
    }
});

//Update
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedList = await List.findByIdAndUpdate(req.params.id, { $set: req.body, }, { new: true });
            res.status(201).json(updatedList)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You are not allowed to update lists!')
    }
});

//Delete
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json('List deleted successfully!')
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You are not allowed to delete Lists!')
    }
});

//Get all users
router.get("/", verify, async (req, res) => {

    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try{
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery, genre: genreQuery}}
                ]);
            } else{
                list = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery}}
                ]);
            }
        }else{
            list = await List.aggregate([
                {$sample: {size: 10}}
            ]);
        }
        res.status(201).json(list)
    } catch(err){
        res.status(500).json(err)
    }
  });


  









//Get
router.get("/find/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const getList = await List.findById(req.params.id);
            res.status(201).json(getList)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You are not allowed to get details of Lists!')
    }
});


//Get random
router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === 'series') {
            movie = await Movie.aggregate([
                {$match: { isSeries: true}},
                {$sample: {size:1}},
            ]);
        } else {
            movie = await Movie.aggregate([
                {$match: { isSeries: false}},
                {$sample: {size:1}},
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err)
    }
});





module.exports = router