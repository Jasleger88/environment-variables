require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const WorkoutNeeds = require('./workoutNeeds')
const port = 3000;
const authController = require("./controllers/auth.js");
const path = require('path')
const methodOverride = require('method-override');
const morgan = require("morgan");
const session = require('express-session');


const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", authController);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);



app.get('/', (req, res) => {
  res.render('home.ejs', {
    user: req.session.user,
  });
});

//Create a route for each category in my WorkoutNeeds List 
//each one is connected to an ejs page/nav bar
app.get('/workoutNeeds', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.find()
  res.render('workoutNeeds.ejs', {
    workoutNeeds: workoutNeeds,
  });
})
app.get('/workoutNeeds/:workoutNeedsId', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.findById(req.params.workoutNeedsId)
  res.render('show.ejs', {
    workoutNeeds,
  })
})
app.get('/new-workout', (req, res) => {
  const workoutNeed = 5;
  res.render("new.ejs", {workoutNeed})
})

app.get('/equipment', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.find()
  res.render('equipment.ejs', { workoutNeeds });
});
app.get('/membership', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.find()
  res.render('membership.ejs', { workoutNeeds });
});
app.get('/schedule', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.find()
  res.render('schedule.ejs', { workoutNeeds });
});
app.get('/trainerPreference', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.find()
  res.render('trainerPreference.ejs', { workoutNeeds });
});
app.get('/duration', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.find()
  res.render('duration.ejs', { workoutNeeds });
});

app.post('/workoutNeeds', async (req, res) => {
  console.log(req.body)
  const workoutNeeds = await WorkoutNeeds.create(req.body)
  res.redirect("/workoutNeeds")
})

app.delete('/workoutNeeds', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.deleteOne(req.body)
  res.send(workoutNeeds)
})

app.put('/workoutNeeds', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.findById(req.params.workoutNeeds)
  const updateWorkoutNeeds = await WorkoutNeeds.updateOne(workoutNeeds, req.body)
  res.send(updateWorkoutNeeds)

})

app.post('/search', async (req, res) => {
  const workoutNeeds = await WorkoutNeeds.find({ membership: req.body.query })
  if (!workoutNeeds) res.status(400).send({ error: "No task was found" })
  res.status(200).send(WorkoutNeeds)
  console.log(req.body)
})

app.delete("/workoutNeeds/:workoutNeedsId", async (req, res) => {
  await WorkoutNeeds.findByIdAndDelete(req.params.workoutNeedsId);
  res.redirect("/workoutNeeds")
})
app.get("/workoutNeeds/:workoutNeedsId/edit", async (req, res) => {
  const findNewWorkout = await workoutNeeds.findById(req.params.workoutNeedsId);
  res.render("workoutNeeds/edit.ejs", {
    workoutNeeds: findNewWorkout,
  });
});
router.post("/sign-in", async (req, res) => {
  // First, get the user from the database
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }
  app.get("/vip-lounge", (req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
  });
  

  // There is a user! Time to test their password with bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }


  req.session.user = {
    username: userInDatabase.username,
  };

  res.redirect("/");
});



// adjust the following:
app.listen(port, () => {
  let port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 3000;
}
console.log(`The express app is ready on port ${port}!`);
console.log(`Your secret is ${ process.env.SECRET_PASSWORD }`);
});
