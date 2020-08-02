const mongoDB = require("mongodb");

const MongoClient = mongoDB.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://shivam145:$Hiv1234@testcluster.pl4tq.mongodb.net/shop"
    )
        .then((client) => {
            console.log("connection successful");
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
        });
};

const getDB = () => {
    if (_db) {
        return _db;
    }
    return null;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
