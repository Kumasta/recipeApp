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

// Delete Comment
// endpoint:  recipes/:id/comments/:commentId
export const deleteComment = async (req, res) => {
  try {
    // Extracting both the recipe id (id) and the commentId from the params
    const { id, commentId } = req.params
    const recipe = await Recipe.findById(id)
    if (!recipe) throw new Error('Recipe not found')
    // id() returns the first item that has a _id field matching the argument
    const commentToDelete = recipe.commentss.id(commentId)
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