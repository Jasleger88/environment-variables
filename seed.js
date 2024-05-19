
const mongoose = require('mongoose');
const workoutNeeds = require('./workoutNeeds');
require('dotenv').config();

async function seed() {
  console.log('Seeding has begun! 🌱')
  mongoose.connect(process.env.MONGODB_URI)
  console.log('Connection successful! 🚀')

 const exercise = await workoutNeeds.create ( {
    equipment: 'Stair Master',
    membership: 'yes',
    schedule: "Monday, Tuesday, Friday",
    trainerPreference: "No",
    duration: 60
 })
}

console.log(workoutNeeds)

 mongoose.disconnect()

 seed()
