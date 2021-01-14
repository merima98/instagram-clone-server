import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    allowNull: false,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    allowNull: false,
    require: true,
  },
  firstName: {
    type: String,
    allowNull: false,
    require: true,
  },
  lastName: {
    type: String,
    allowNull: false,
    require: true,
  },
  username: {
    type: String,
    allowNull: false,
    require: true,
    unique: true,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
