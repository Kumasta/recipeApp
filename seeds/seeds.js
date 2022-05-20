import mongoose from 'mongoose' // mongoose will allow us to connect to the DB
import movieData from './data/movies.js' // Bring in the data file
import userData from './data/users.js' // Bring in the data file
import { dbURI } from '../config/environment.js' // Bring in our environment variables
import Recipe from '../models/recipe.js' // Bring in our Movie model
import User from '../models/user.js' // Bring in our Movie model

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(dbURI)
    console.log('🚀 Database Connected')

    // Drop all data from the database
    await mongoose.connection.db.dropDatabase()
    console.log('👌 Database dropped')

    // Create users
    const users = await User.create(userData)
    console.log(`🌱 ${users.length} users added`)

    // Loop through movie data and apply an owner field to each object with the id of the first user created above
    const moviesWithOwners = movieData.map(movie => {
      return { ...movie, owner: users[0]._id }
    })

    // Seed all the collections we have with our data
    const moviesAdded = await Recipe.create(moviesWithOwners)
    console.log(`🌱 Seeded database with ${moviesAdded.length} movies`)

    // Close database connection
    await mongoose.connection.close()
    console.log('👋 Bye!')
  } catch (err) {
    console.log(err)
    // Close database connection
    await mongoose.connection.close()
  }
}
seedDatabase()