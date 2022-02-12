const mongoose = require('mongoose');
function DbConnect() {
    const DB_URL = process.env.MONGODB_URL;
    // Database connection
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connected😀😀😀');
    });
}

module.exports = DbConnect;