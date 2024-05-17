require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const WorkoutNeeds = require('./workoutNeeds')
const port = 3000;
const path = require('path')
const methodOveride = require('method-override');
const morgan = require("morgan");

const app = express();

mongoose.connect(process.env.MONGODB_URI)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOveride("_method"));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));


app.get('/', (req, res) => {
  res.render('home.ejs');
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
  res.render("new.ejs")
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


// adjust the following:
app.listen(port, () => {
   
  console.log('Listening on port 3000');
  console.log(`Your secret is ${ process.env.SECRET_PASSWORD }`);
});

