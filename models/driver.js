const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    age: { type: Number, required: true,  },
    truckCapacity: { type: String, required: true,  },
    mobileNumber: { type: Number, required: true,  },
    truckumber: { type: Number, required: true,  },
    transporter: { type: String, required: true,  },
    experience: { type: String, required: true,  },
    password: { type: String, required: true },
    fromCity: { type: String, defaut: "", required: true },
    toCity: { type: String, defaut: "", required: true },
    isDriver: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);