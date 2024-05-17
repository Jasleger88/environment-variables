const mongoose = require('mongoose')

const workoutNeedsSchema= new mongoose.Schema({
  equipment: { type: String, required: true },  
  membership: { type: String, required: false },
  schedule: { type: String, required: false },
  trainerPreference: { type: String, required: true},
  duration: { type: Number, required: true}
})

module.exports = mongoose.model('WorkoutNeed', workoutNeedsSchema)