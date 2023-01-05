const { MongoClient, ObjectId } = require("mongodb");
module.exports.HttpApi = class HttpApi {
  constructor() {
    if (!MongoDbConnection._instance) {
      const mongoClient = new MongoClient(
        "mongodb://cosmosaccounttry:SUcNspJmg0w7SIAsgh8qUY8umDW8jWmVCzBfVnANSaezVIvio6ZBUGdh3nzKeY0jYsbK4phgiEg6ACDbjQ41yQ%3D%3D@cosmosaccounttry.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmosaccounttry@"
      );
      this.database = mongoClient.db("chatbot");
      MongoDbConnection._instance = this;
    }
    return MongoDbConnection._instance;
  }

  static getInstance() {
    return this._instance;
  }
};
