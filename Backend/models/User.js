const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  ethKeyPair: {
    address: String,
    privateKey: String,
  },
  solKeyPair: {
    address: String,
    privateKey: String,
  },
});

module.exports = mongoose.model("User", UserSchema);