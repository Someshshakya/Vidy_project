const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ Welcome: "Do what you like Most!" });
});
module.exports = router;
