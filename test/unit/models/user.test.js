const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid jwt ", () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateToken();
    const decoded = jwt.verify(token, "somesh");
    expect(decoded).toMatchObject(payload);
  });
});
