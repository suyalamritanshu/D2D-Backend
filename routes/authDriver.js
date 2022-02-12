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
        truckCapacity: req.body.truckCapacity,
        mobileNumber: req.body.mobileNumber,
        truckumber: req.body.truckumber,
        transporter: req.body.transporter,
        experience: req.body.experience,
        fromCity: req.body.fromCity,
        toCity: req.body.toCity,
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
      const user = await User.findOne({ name: req.body.name });
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
module.exports = router;
