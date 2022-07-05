// Models
import Recipe from '../models/recipe.js'

// Controllers
export const getAllRecipes = async (_req, res) => {
  try {
    const recipes = await Recipe.find().populate('owner')
    // Find all recipes and show owner
    console.log(recipes)
    // log the recipes
    return res.status(200).json(recipes)
    // return array of recipes to user
  } catch (err) {
    console.log(err)
  }
}

export const addRecipe = async (req, res) => {
  try {

    console.log('req.currentUser', req.currentUser)
    // Log current logged in user
    console.log('req.body', req.body)
    //Log the body of recipe to be added
    const recipeToAdd = await Recipe.create({ ...req.body, owner: req.currentUser._id })
    // Create recipe document, add owner from current user id
    return res.status(201).json(recipeToAdd)
    // Return new document to user.
  } catch (err) {
    console.log(err)
    return res.status(422).json(err)
  }
}

export const getSingleRecipe = async (req, res) => {
  try {
    const { id } = req.params
    // Get recipe Id
    const recipe = await Recipe.findById(id).populate('owner').populate('comments.owner')
    // Find recipe by if and show owner details and comments
    console.log(recipe)
    // log recipe
    return res.status(200).json(recipe)
    // return recipe document
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: 'Not Found' })
  }
}

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params
    // Get recipe Id from url
    const recipeToUpdate = await Recipe.findById(id)
    // finds and stores recipe by id
    if (!recipeToUpdate.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    // Check to see if user is owner or authorised to update the recipe
    Object.assign(recipeToUpdate, req.body)
    // assigns recipe object to new body passed
    await recipeToUpdate.save()
    // saves the new object
    return res.status(202).json(recipeToUpdate)
    // returns the updated document
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const recipeToDelete = await Recipe.findById(id)
    if (!recipeToDelete.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    await recipeToDelete.remove()
    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}