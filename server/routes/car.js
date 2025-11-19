let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to our Car model
let Car = require('../model/car');

// auth guard
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

// READ – list all cars
router.get('/', async (req, res, next) => {
  try {
    let carList = await Car.find().sort({ year: -1 });

    res.render('Cars/list', {
      title: 'Inventory',
      CarList: carList,
      displayName: req.user ? req.user.displayName : ''
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// GET – Add Car page
router.get('/add', requireAuth, (req, res, next) => {
  res.render('Cars/add', {
    title: 'Add Car',
    displayName: req.user ? req.user.displayName : ''
  });
});

// POST – process Add Car
router.post('/add', requireAuth, async (req, res, next) => {
  try {
    let newCar = new Car({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      mileage: req.body.mileage,
      condition: req.body.condition,
      description: req.body.description,
      imageUrl: req.body.imageUrl
    });

    await Car.create(newCar);
    res.redirect('/cars');
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// GET – Edit page
router.get('/edit/:id', requireAuth, async (req, res, next) => {
  try {
    let id = req.params.id;
    let carToEdit = await Car.findById(id);

    res.render('Cars/edit', {
      title: 'Edit Car',
      car: carToEdit,
      displayName: req.user ? req.user.displayName : ''
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// POST – process Edit
router.post('/edit/:id', requireAuth, async (req, res, next) => {
  try {
    let id = req.params.id;

    let updatedCar = {
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      mileage: req.body.mileage,
      condition: req.body.condition,
      description: req.body.description,
      imageUrl: req.body.imageUrl
    };

    await Car.updateOne({ _id: id }, updatedCar);
    res.redirect('/cars');
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// GET – Delete confirmation page
router.get('/delete/:id', requireAuth, async (req, res, next) => {
  try {
    let id = req.params.id;
    let carToDelete = await Car.findById(id);

    res.render('Cars/delete', {
      title: 'Delete Car',
      car: carToDelete,
      displayName: req.user ? req.user.displayName : ''
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// POST – actually delete the car
router.post('/delete/:id', requireAuth, async (req, res, next) => {
  try {
    let id = req.params.id;
    await Car.deleteOne({ _id: id });
    res.redirect('/cars');
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
