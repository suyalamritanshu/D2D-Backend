const router = require("express").Router();
const User = require("../models/dealer");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");
const { Auth } = require("two-step-auth");
let otp1;
async function login(emailId) {
  const ress1 = await Auth(emailId, "D2D");
  return ress1.OTP;
}
router.get("/loginSendOTP", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json("User doesn't exist");
  }
  otp1 = await login(req.body.email);
  res.status(200).json(otp1);
});
router.post("/postOTP", (req, res) => {
  if (req.body.otp === otp1) {
    res.status(200).json({ success: true });
  } else {
    res.status(404).json("error");
  }
});
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
      userType: req.body.userType,
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
    // !user && res.status(401).json("Wrong password or username!");

    if (!user) {
      return res.status(401).json("User doesn't exist");
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json("Wrong password");
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(401).json("Wrong password");
  }
});
// router.post("/verify", (req,res)=>{
//   if(req.body.otp == )
// })

router.post("/loginDealerOTP", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // !user && res.status(401).json("Wrong password or username!");

    if (!user) {
      return res.status(401).json("User doesn't exist");
    }

    let otp = sendOTP();

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(401).json("Wrong password");
  }
});

function sendOTP() {
  let otp = Math.floor(100000 + Math.random() * 900000);
  // send otp to mail
  return otp;
}

//get all dealers for a particular route

router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.state;
  const genreQuery = req.query.city;
  let user = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        user = await User.aggregate([
          { $sample: { size: 10 } },
          { $match: { state: typeQuery, city: genreQuery } },
        ]);
      } else {
        user = await User.aggregate([
          { $sample: { size: 10 } },
          { $match: { state: typeQuery } },
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
