import User from '../models/user.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.currentUser._id).populate('ownedMovies')
    console.log(user)
    if (!user) throw new Error('User not found')
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}