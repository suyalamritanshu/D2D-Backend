const router = require("express").Router();
const User = require("../models/driver");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");

//Register
router.post("/registerDriver", async (req, res) => {
  try {
    const newUser = await new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        truckCapacity: req.body.truckCapacity,
        mobileNumber: req.body.mobileNumber,
        truckumber: req.body.truckumber,
        transporter: req.body.transporter,
        experience: req.body.experience,
        fromCity1: req.body.fromCity1,
        toCity1: req.body.toCity1,
        fromCity2: req.body.fromCity2,
        toCity2: req.body.toCity2,
        fromCity3: req.body.fromCity3,
        toCity3: req.body.toCity3,
        isDriver: req.body.isDriver,

      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login
router.post("/loginDriver", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(401).json("Wrong password or username!");
  
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  
      if(originalPassword !== req.body.password){
       
        return res.status(401).json("Wrong password");
      }
  
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
  
      const { password, ...info } = user._doc;
  
      res.status(200).json({ ...info, accessToken });
    } catch (err) {
      res.status(401).json('Wrong password');
    }
  });

  //get all drivers

  router.get("/allDrivers", async (req, res) => {
      try {
        const user = await User.find();
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    
  });

  //get all drivers for a particular route

  router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.fromCity1;
    const genreQuery = req.query.fromCity2;
    const genreQuery1 = req.query.fromCity3;

    let user = [];
    try {
      if (typeQuery) {
        if (genreQuery) {
          if(genreQuery1){
          user = await User.aggregate([
            { $sample: { size: 10 } },
            { $match: { fromCity1: typeQuery, fromCity2: genreQuery, fromCity3: genreQuery1 } },
            
          ]);
        }
        } else {
          user = await User.aggregate([
            { $sample: { size: 10 } },
            { $match: { fromCity1: typeQuery } },
          ]);
        }
      } else {
        user = await User.aggregate([{ $sample: { size: 10 } }]);
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports = router;
