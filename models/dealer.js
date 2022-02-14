const mongoose = require("mongoose");

const DealerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    nature: { type: String, required: true,  },
    email: { type: String, required: true, unique: true  },
    mobileNumber: { type: Number, required: true,  },
    weight: { type: Number, required: true,  },
    quantity: { type: Number, required: true,  },
    city: { type: String, required: true,  },
    password: { type: String, required: true },
    state: { type: String, defaut: "", required: true },
    userType: { type: String, default: "", required: true },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dealer", DealerSchema);