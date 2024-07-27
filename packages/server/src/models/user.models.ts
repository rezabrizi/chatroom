import { Schema, model, Document } from "mongoose";

// Define a user interface
interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  createdAt: Date;
}

// create a schema for the database
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "user-data" }
);

// a model is a class that allows us to create documents (like rows in a relational database)
const User = model<IUser>("User", userSchema);
export default User;
