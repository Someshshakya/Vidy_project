const { User } = require("../../models/users");
const request = require("supertest");
const server = require("../../index");
describe("auth middleware", () => {
  let server;
  let token;
  //prettier-ignore
  beforeEach(() => {
    token = new User().generateToken(); 
    server = require("../../index");
});
  afterEach(async () => {
    await server.close();
  });

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  it("should return 401 if no token is provided", async () => {
    token = ";";
    const res = await exec();
    expect(res.status).toBe(401);
  });
});
