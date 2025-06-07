// userModel.js
import mongoose from "mongoose";
// import { Terser } from 'vite';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  suburb: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  territory: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  fileUploader: {
    type: String,
    default: null,
  },
  fileUploaderOriginalName: {
    type: String,
    default: null,
  },

  bio: {
    type: String,
    default: "",
  },

  profileLinks: {
    linkedIn: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
});

// ✅ Define toJSON BEFORE creating the model
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // 🛡️ Remove password from JSON responses
  return user;
};

const User = mongoose.model("User", UserSchema);

export { User }; // 👌 Named export
