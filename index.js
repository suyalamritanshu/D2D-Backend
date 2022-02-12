const express = require("express");
const app = express();
const dotenv = require("dotenv");
const DbConnect = require('./database');
const PORT = process.env.PORT || 4000;
const DriverRoute = require("./routes/authDriver");
const DealerRoute = require("./routes/authDealer");



dotenv.config();

//Database Connection

DbConnect();

app.use(express.json());

app.use("/api/authDriver", DriverRoute);
app.use("/api/authDealer", DealerRoute);




app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});