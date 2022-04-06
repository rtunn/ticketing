import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";
import mongoose from "mongoose";

const signup = () => {
  // Build JWT Payload
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJson = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`];
};

export default signup;
