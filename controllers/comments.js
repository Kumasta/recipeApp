// Models
import Recipe from '../models/recipe.js'

// Comments

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params
    // Get the recipe
    const recipe = await Recipe.findById(id)
    // Check recipe exists
    if (!recipe) throw new Error('Recipe not found')
    // Define new comment
    const newComment = { ...req.body, owner: req.currentUser._id }
    // Push newComment to recipe.comments
    recipe.comments.push(newComment)
    // Once we've pushed newComment to recipe.comments, we need to save to finalise the changes
    await recipe.save()
    // console.log( recipe comments', recipe.comments)
    return res.status(201).json(recipe)
  } catch (err) {
    console.log(err)
    return res.status(422).json({ message: err.message })
  }
}

//Update Comment
export const updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params
    // Get the recipe
    const recipe = await Recipe.findById(id)
    // Check recipe exists
    if (!recipe) throw new Error('Recipe not found')
    // check if recipe is in list
    const commentToUpdate = recipe.comments.id(commentId)
    // get commnent of recipe by id
    console.log('--->', commentToUpdate)
    // log the comment
    if (!commentToUpdate) throw new Error('No comment found!')
    // check if comment was found
    console.log(req.body)
    if (!commentToUpdate.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    // test if owner of comment made the request
    Object.assign(commentToUpdate, req.body)
    // update the comment from req body
    await recipe.save()
    // save the document
    return res.status(202).json(commentToUpdate)
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: err.message })
  }
}


// Delete Comment
// endpoint:  recipes/:id/comments/:commentId
export const deleteComment = async (req, res) => {
  try {
    // Extracting both the recipe id (id) and the commentId from the params
    const { id, commentId } = req.params
    const recipe = await Recipe.findById(id)
    if (!recipe) throw new Error('Recipe not found')
    // id() returns the first item that has a _id field matching the argument
    const commentToDelete = recipe.comments.id(commentId)
    // Check commentToDelete is not null
    if (!commentToDelete) throw new Error('Comment not found')
    // We now need to check that the user making the request owns the commnet
    if (!commentToDelete.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    // Remove the comment
    await commentToDelete.remove()
    // Save the recipe with the updated path
    await recipe.save()
    // Return response to user
    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
  }
}


// * Comment Likes *
export const likeComment = async (req, res) => {
  try {
    const { id, commentId } = req.params
    // console.log(id)
    const recipe = await Recipe.findById(id)
    // console.log(recipe)
    // console.log(req.body)
    if (!recipe) throw new Error('Recipe not found')
    const commentToLike = recipe.comments.id(commentId)
    if (!commentToLike) throw new Error('Comment not found')
    const like = { ...req.body, owner: req.currentUser._id }
    // console.log(newRating)
    commentToLike.likes.push(like)
    // console.log(recipe)
    await recipe.save()
    res.status(201).json(recipe)
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: err.message })
  }
}

export const deleteCommentLike = async (req, res) => {
  try {
    const { id, commentId, likeId } = req.params
    // console.log(id, commentId)
    const recipe = await Recipe.findById(id)
    // console.log(recipe.comments)
    if (!recipe) throw new Error('Pin was not found')
    const comment = recipe.comments.id(commentId)
    // console.log(comment)
    if (!comment) throw new Error('Review not found')
    const likeToRemove = comment.likes.id(likeId)
    console.log(likeToRemove)
    if (!likeToRemove) throw new Error('Not Liked')
    if (!likeToRemove.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    await likeToRemove.remove()
    await recipe.save()
    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: err.message })
  }
}