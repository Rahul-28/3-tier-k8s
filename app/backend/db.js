const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const MONGO_CONN_STR = process.env.MONGO_CONN_STR || "mongodb://localhost:27017/todo?directConnection=true";
        const connectionParams = {
            // user: process.env.MONGO_USERNAME,
            // pass: process.env.MONGO_PASSWORD,
            useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        };
        const useDBAuth = process.env.USE_DB_AUTH === 'true';
        if (useDBAuth) {
            connectionParams.user = process.env.MONGO_USERNAME;
            connectionParams.pass = process.env.MONGO_PASSWORD;
        }
        await mongoose.connect(
            MONGO_CONN_STR,
            connectionParams
        );
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database.", error);
        throw error;
    }
};
