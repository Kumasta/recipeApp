import express from 'express' // bring in express

import { secureRoute } from './secureRoute.js'

// Controllers
import { getAllRecipes, addRecipe, getSingleRecipe, updateRecipe, deleteRecipe, addComment, deleteComment } from '../controllers/recipe.js'
import { registerUser, loginUser } from '../controllers/auth.js'
import { getCurrentUserProfile, updateCurrentUserProfile, getAllUsers, viewUserProfile } from '../controllers/users.js'

// Defines the router on which we'll add all of our routes, methods and controllers
const router = express.Router()

// Recipes
router.route('/recipes')
  .get(getAllRecipes) // ✅
  .post(secureRoute, addRecipe)

// Single recipe
router.route('/recipes/:id')
  .get(getSingleRecipe) // ✅
  .put(secureRoute, updateRecipe)
  .delete(secureRoute, deleteRecipe)

// Comments
router.route('/recipes/:id/comments')
  .post(secureRoute, addComment)

router.route('/recipes/:id/comments/:commentId')
  .delete(secureRoute, deleteComment)

// Auth routes //
// Register
router.route('/register')
  .post(registerUser) // ✅

// Login
router.route('/login')
  .post(loginUser) // ✅

// Profile 

router.route('/profiles')
  .get(getAllUsers) // ✅

router.route('/profile')
  .get(secureRoute, getCurrentUserProfile) // ✅
  .put(secureRoute, updateCurrentUserProfile)

router.route('/profile/:id')
  .get(viewUserProfile) // ✅

export default router