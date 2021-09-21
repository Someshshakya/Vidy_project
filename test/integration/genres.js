const request = require("supertest");
const { exception } = require("winston");
const { Genre } = require("../../models/genre");
const { Movie } = require("../../models/movie");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/users");
let server;
describe("/api/genres", () => {
  //prettier-ignore
  beforeEach(() => {server = require("../../index");});
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
    await Movie.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Get /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if invalid id is passed ", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    //defines the happy path, and  then each test , we change
    // one parameter that clearly aligns with the name of the test
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };
    beforeEach(() => {
      token = new User().generateToken();
      name = "genre1";
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 charater ", async () => {
      name = "1345";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 charater ", async () => {
      name = new Array(27).join("ab");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should save the genre if the genre is valid ", async () => {
      //
      const res = await exec();
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
    it("should return  the genre if input is valid ", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
