require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const WorkoutNeeds = require('./workoutNeeds')
const authController = require("./controllers/authController.js");
const path = require('path')
const methodOverride = require('method-override');
const morgan = require("morgan");
const session = require('express-session');
// const User = require(".models/user");



const app = express();

mongoose.connect(process.env.MONGODB_URI);
// mongoose.connection.on('connected', () => {
//   console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
// })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookies: {secure: false}
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/auth", authController);

app.use((req, res, next) => {
  if (req.session.message) {
    res.locals.message = req.session.message;
    req.session.message = null;
  }
  next();
});


app.get('/', (req, res) => {
  res.render('home.ejs', { user: req.session.user });
});

app.get('/workoutNeeds', async (req, res) => {
  try {
    const workoutNeeds = await WorkoutNeeds.find();
    res.render('workoutNeeds.ejs', { workoutNeeds });
  } catch (error) {
    res.render ("error.ejs", {error: error.message})
  }
});

app.get('/workoutNeeds/:workoutNeedsId', async (req, res) => {
  try {
    const workoutNeeds = await WorkoutNeeds.findById(req.params.workoutNeedsId);
    res.render('show.ejs', { workoutNeeds });
  } catch (error) {
    res.render ("error.ejs", {error: error.message})
  }
});

app.get('/new-workout', (req, res) => {
  res.render("new.ejs");
});

const categories = ['equipment', 'membership', 'schedule', 'trainerPreference', 'duration'];
categories.forEach(category => {
  app.get(`/${category}`, async (req, res) => {
    try {
      const workoutNeeds = await WorkoutNeeds.find();
      res.render(`${category}.ejs`, { workoutNeeds });
    } catch (error) {
      res.render ("error.ejs", {error: error.message})
    }
  });
});

app.post('/workoutNeeds', async (req, res) => {
  try {
    await WorkoutNeeds.create(req.body);
    res.redirect("/workoutNeeds");
  } catch (error) {
    res.render ("error.ejs", {error: error.message})
  }
});

app.delete('/workoutNeeds/:workoutNeedsId', async (req, res) => {
  try {
    await WorkoutNeeds.findByIdAndDelete(req.params.workoutNeedsId);
    res.redirect("/workoutNeeds");
  } catch (error) {
    res.render ("error.ejs", {error: error.message})
  }
});

app.get("/workoutNeeds/:workoutNeedsId/edit", async (req, res) => {
  try {
    const workoutNeeds = await WorkoutNeeds.findById(req.params.workoutNeedsId);
    res.render("edit.ejs", { workoutNeeds });
  } catch (error) {
    res.render ("error.ejs", {error: error.message})
  }
});

app.put('/workoutNeeds/:workoutNeedsId', async (req, res) => {
  try {
    const workoutNeeds = await WorkoutNeeds.findByIdAndUpdate(req.params.workoutNeedsId, req.body, { new: true });
    res.send(workoutNeeds);
  } catch (error) {
    res.render ("error.ejs", {error: error.message})
  }
});

app.post('/search', async (req, res) => {
  try {
    const workoutNeeds = await WorkoutNeeds.find({ membership: req.body.query });
    if (!workoutNeeds.length) {
      res.redirect({ error: "No task was found" });
    } else {
      res.send(workoutNeeds);
    }
  } catch (error) {
    res.render ("error.ejs", {error: error.message})
  }
});

app.post("/workoutNeeds", async (req, res) => {
  try {
    await workoutNeeds.create(req.body);
    req.session.message = "Workout Need successfully created.";
    res.redirect("/workoutNeeds");
  } catch (error) {
    req.session.message = error.message;
    res.redirect("/workoutNeeds");
  }
});
  if (req.session.user) {
    const workoutNeeds = await workoutNeeds.create(req.body);
    res.redirect("/workoutNeeds");
  } else {
    res.redirect("/auth/sign-in");
  }
  
app.put("/workoutNeeds/:workoutNeedId", async (req, res) => {
  const updatedNeed = await WorkoutNeeds.findByIdAndUpdate(
    req.params.workoutNeeds,
    req.body,
    { new: true }
  );
  res.send(updatedNeed);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Your secret is ${process.env.SECRET_PASSWORD}`);
  console.log(`My mongo db url is ${process.env.MONGODB_URI}`);
});