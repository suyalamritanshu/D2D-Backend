const router = require("express").Router();
const User = require("../models/dealer");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/registerDealer", async (req, res) => {
  try {
    const newUser = await new User({
        name: req.body.name,
        email: req.body.email,
        nature: req.body.nature,
        weight: req.body.weight,
        mobileNumber: req.body.mobileNumber,
        quantity: req.body.quantity,
        city: req.body.city,
        state: req.body.state,
        isDealer: req.body.isDealer,

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
router.post("/loginDealer", async (req, res) => {
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
module.exports = router;
