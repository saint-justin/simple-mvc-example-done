// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Cat model
const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAdded = new Cat(defaultData);

// function to handle requests to the main page
const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

// function to find all cats on request.
const readAllCats = (req, res, callback) => {
  Cat.find(callback).lean();
};

// function to find a specific cat on request.
const readCat = (req, res) => {
  const name1 = req.query.name;

  // function to call when we get objects back from the database.
  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  // Behind the scenes this runs the findOne method.
  // You can find the findByName function in the model file.
  Cat.findByName(name1, callback);
};

// function to handle requests to the page1 page
const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

// function to handle requests to the page2 page
const hostPage2 = (req, res) => {
  res.render('page2');
};

// function to handle requests to the page3 page
const hostPage3 = (req, res) => {
  res.render('page3');
};

// function to handle requests to the page4 page
const hostPage4 = (req, res) => {
  res.render('page4');
};

// function to handle get request to send the name
const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

// function to handle a request to set the name
const setName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);
  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded = newCat;
    res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned });
  });

  // if error, return it
  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

// function to handle a request to set the name
const setDog = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const dogData = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);
  const savePromise = newDog.save();

  // if error, return it
  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

// function to handle requests search for a name and return the object
const searchName = (req, res) => {
  // Bail out if there's no name appended
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  // Call our Cat's static findByName function.
  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

// function to handle requests search for a name and return the object
const updateDog = (req, res) => {
  // Bail out if there's no name appended
  if (!req.query.name) {
    return res.status(400).json({ error: 'Dog name not included, you muppet' });
  }

  // Call our Dog's static findByName function.
  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'Dog not found :(' });
    }

    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

// function to handle a request to update the last added object
const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save();
  savePromise.then(() => res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned }));
  savePromise.catch((err) => res.status(500).json({ err }));
};

// function to handle a request to any non-real resources (404)
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  setDog,
  updateDog,
  readCat,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
