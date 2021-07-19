const seeder = require("mongoose-seed");
const mongoose = require("mongoose");

seeder.connection(
  "mongodb://localhost:27017/homeStay",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  },
  () => {
    // load model
    seeder.loadModels(["./model/User.js"]);

    seeder.clearModels(["User"], () => {
      seeder.pupolateModels(data, () => {
        seeder.disconnect();
      });
    });
  }
);

const data = [
  {
    model: "User",
    document: [
      {
        name: "Wiby Fabian Rianto",
        password: "masterofcad",
      },
    ],
  },
];
