const router = require("express").Router();
const User = require("../models/driver");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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
  
      originalPassword !== req.body.password &&
        res.status(401).json("Wrong password or username!");
  
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
  
      const { password, ...info } = user._doc;
  
      res.status(200).json({ ...info, accessToken });
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get("/:fromCity1/:fromCity2/:fromCity3", async (req, res) => {
    try {
      const user = await User.findA({
        members: { $all: [req.params.fromCity1, req.params.fromCity2, req.params.fromCity3 ] },
      });
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports = router;
