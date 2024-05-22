const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  text: {type:String, required: true},
  reviewer: {type: mongoose.Schema.ObjectId, required: true, ref: "user"},
}, 
{timeStamps: true}
);

const workoutNeedsSchema= new mongoose.Schema({
  equipment: { type: String, required: true },  
  membership: { type: String, required: false },
  schedule: { type: String, required: false },
  trainerPreference: { type: String, required: true},
  duration: { type: Number, required: true},
  createdBy: {type: mongoose.Schema.ObjectId, ref: "User"},
  reviews: [reviewSchema],
})
const WorkoutNeeds =  mongoose.model('WorkoutNeed', workoutNeedsSchema)
module.exports = WorkoutNeeds