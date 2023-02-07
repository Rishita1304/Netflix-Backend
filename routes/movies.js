const router = require('express').Router();
const verify = require('../verifyToken');
const Movie = require("../models/Movie.js");

//Create
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body)
        try {
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie)
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
            const newMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body, }, { new: true });
            res.status(201).json(newMovie)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You are not allowed to update movies!')
    }
});

//Delete
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(201).json('Movie deleted successfully!')
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You are not allowed to delete movies!')
    }
});

//Get
router.get("/find/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const getMovie = await Movie.findById(req.params.id);
            res.status(201).json(getMovie)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You are not allowed to get details of movies!')
    }
});

//Get all movies
router.get("/", verify, async (req, res) => {
    if(req.user.isAdmin){
      try{
        const movie = await Movie.find();
        res.status(201).json(movie)
      } catch(err){
        res.status(500).json(err)
      }
    } else{
      res.status(403).json('You are not allowed to see all users!')
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