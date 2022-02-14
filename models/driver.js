const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    age: { type: Number, required: true,  },
    truckCapacity: { type: String, required: true,  },
    email: { type: String, required: true, unique: true  },
    mobileNumber: { type: Number, required: true,  },
    truckumber: { type: Number, required: true,  },
    transporter: { type: String, required: true,  },
    experience: { type: String, required: true,  },
    password: { type: String, required: true },
    fromCity1: { type: String, defaut: "", required: true },
    toCity1: { type: String, defaut: "", required: true },
    fromCity2: { type: String, defaut: "", required: true },
    toCity2: { type: String, defaut: "", required: true },
    fromCity3: { type: String, defaut: "", required: true },
    toCity3: { type: String, defaut: "", required: true },
    userType: { type: String, default: "", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);