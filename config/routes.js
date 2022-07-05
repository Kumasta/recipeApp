import express from 'express' // bring in express

import { secureRoute } from './secureRoute.js'

// Controllers
import { registerUser, loginUser } from '../controllers/auth.js'
import { getAllRecipes, addRecipe, getSingleRecipe, updateRecipe, deleteRecipe } from '../controllers/recipe.js'
import { getCurrentUserProfile, updateCurrentUserProfile, getAllUsers, viewUserProfile } from '../controllers/users.js'
import { addComment, updateComment, deleteComment, likeComment, deleteCommentLike } from '../controllers/comments.js'

// Defines the router on which we'll add all of our routes, methods and controllers
const router = express.Router()

// *Auth routes*
// Register
router.route('/register')
  .post(registerUser) // ✅

// Login
router.route('/login')
  .post(loginUser) // ✅

// *Recipes*
router.route('/recipes')
  .get(getAllRecipes) // ✅
  .post(secureRoute, addRecipe) // ✅ Not tested with recipe steps 

// Single recipe
router.route('/recipes/:id')
  .get(getSingleRecipe) // ✅
  .put(secureRoute, updateRecipe) // ✅ // ✅ Not tested with recipe steps 
  .delete(secureRoute, deleteRecipe) // ✅ 

// *Comments*
router.route('/recipes/:id/comments')
  .post(secureRoute, addComment) // ✅

router.route('/recipes/:id/comments/:commentId')
  .put(secureRoute, updateComment) // ✅
  .delete(secureRoute, deleteComment) // ✅

// *Comment Likes
router.route('/recipes/:id/comments/:commentId/likes')
  .post(secureRoute, likeComment) // ✅ Need to prevent user from being able to add more than 1 like obj in the array

router.route('/recipes/:id/comments/:commentId/likes/:likeId')
  .delete(secureRoute, deleteCommentLike) // ✅

// *Profile*
router.route('/profiles')
  .get(getAllUsers) // ✅

router.route('/profile')
  .get(secureRoute, getCurrentUserProfile) // ✅
  .put(secureRoute, updateCurrentUserProfile) // ✅

router.route('/profile/:id')
  .get(viewUserProfile) // ✅

export default router