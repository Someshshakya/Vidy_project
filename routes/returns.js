const moment = require("moment");
const Joi = require("joi");
const { Rental } = require("../models/rental");
const express = require("express");
const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const router = express.Router();
// // when customer is not logged in

router.post("/", auth, async (req, res) => {
  //Before refactoring
  if (!req.body.customerId) return res.status(400).send("CustomerId not found");
  if (!req.body.movieId) return res.status(400).send("movieId not found");
  // rental static method added to rental Schema
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("no rentals found");
  if (rental.dateReturned)
    return res.status(400).send("Rental already processed");
  if (!rental) return res.status(404).send("rentals not found");
  rental.dateReturned = new Date();

  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  rental.return();
  await rental.save();
  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });
  return res.status(200).send(rental);
});

// function validateReturn(req) {
//   const schema = {
//     customerId: Joi.ObjectId().required(),
//     movieId: Joi.ObjectId().required(),
//   };

//   return Joi.validate(req, schema);
// }
module.exports = router;
