// Models
import Recipe from '../models/recipe.js'

// Controllers
export const getAllRecipes = async (_req, res) => {
  try {
    const recipe = await Recipe.find().populate('owner')
    console.log(recipe)
    return res.status(200).json(recipe)
  } catch (err) {
    console.log(err)
  }
}

export const addRecipe = async (req, res) => {
  try {

    console.log('req.currentUser', req.currentUser)
    console.log('req.body', req.body)
    const movieToAdd = await Recipe.create({ ...req.body, owner: req.currentUser._id })
    return res.status(201).json(movieToAdd)
  } catch (err) {
    console.log(err)
    return res.status(422).json(err)
  }
}

export const getSingleRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const recipe = await Recipe.findById(id).populate('owner').populate('reviews.owner')
    console.log(recipe)
    return res.status(200).json(recipe)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: 'Not Found' })
  }
}

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const movieToUpdate = await Recipe.findById(id)
    if (!movieToUpdate.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    Object.assign(movieToUpdate, req.body)
    await movieToUpdate.save()
    return res.status(202).json(movieToUpdate)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const movieToDelete = await Recipe.findById(id)
    if (!movieToDelete.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    await movieToDelete.remove()
    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}


// Reviews

// Add a review
export const addComment = async (req, res) => {
  try {
    const { id } = req.params
    // Get the recipe
    const recipe = await Recipe.findById(id)
    // Check recipe exists
    if (!recipe) throw new Error('Recipe not found')
    // Define new comment
    const newComment = { ...req.body, owner: req.currentUser._id }
    // Push newComment to movie.comments
    recipe.comments.push(newComment)
    // Once we've pushed newComment to movie.comments, we need to save to finalise the changes
    await recipe.save()
    // console.log('movie comments', movie.comments)
    return res.status(201).json(recipe)
  } catch (err) {
    console.log(err)
    return res.status(422).json({ message: err.message })
  }
}

// Delete Review
// endpoint: /movies/:id/reviews/:reviewId
export const deleteComment = async (req, res) => {
  try {
    // Extracting both the movie id (id) and the commentId from the params
    const { id, commentId } = req.params
    const recipe = await Recipe.findById(id)
    if (!recipe) throw new Error('Movie not found')
    // id() returns the first item that has a _id field matching the argument
    const commentToDelete = recipe.reviews.id(commentId)
    // Check commentToDelete is not null
    if (!commentToDelete) throw new Error('Review not found')
    // We now need to check that the user making the request owns the review
    if (!commentToDelete.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    // Remove the review
    await commentToDelete.remove()
    // Save the movie with the updated path
    await recipe.save()
    // Return response to user
    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
  }
}