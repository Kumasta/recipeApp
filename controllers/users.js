import User from '../models/user.js'

// Get Current user profile
export const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.currentUser._id).populate('ownedRecipes').populate('profile')
    // get user by Id and show recipes owned
    console.log(user)
    // log user
    if (!user) throw new Error('User not found')
    // throw error is user in not found or does not exist. 
    return res.status(200).json(user)
    // return user document
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}

// Update logged in user
export const updateCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.currentUser._id)
    // get user docuemtn by Id
    if (!user) throw new Error('User not found')
    // throw error is user in not found or does not exist. 
    const profileToUpdate = user.profile
    // 
    console.log(profileToUpdate)
    Object.assign(profileToUpdate, req.body)
    await user.save()
    return res.status(202).json(profileToUpdate)
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
}



// ** Get user profile **

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().populate('ownedRecipes').populate('profile')
    // Find all recipes and show owner
    console.log(users)
    // log the recipes
    return res.status(200).json(users)
    // return array of recipes to user
  } catch (err) {
    console.log(err)
  }
}

export const viewUserProfile = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    console.log('id:', id)
    const user = await User.findById(id).populate('ownedRecipes').populate('profile')
    console.log('Succes:', user)
    return res.status(200).json(user)
  } catch (err) {
    return res.status(404).json({ message: 'user not found.' })
  }
}
