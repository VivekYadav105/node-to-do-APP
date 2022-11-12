const mongoose = require("mongoose");

const createConnection = (URL) => {
  return mongoose
    .connect(URL)
    .then("connected to succesfully")
    .catch((err) => {
      console.log(err);
    });
};

module.exports = createConnection
