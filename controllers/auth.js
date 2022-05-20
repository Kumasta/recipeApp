import User from '../models/user.js' // importing the user model to query the users collection
import jwt from 'jsonwebtoken' // import jwt so we can create a token to send back during a successful login
import { secret } from '../config/environment.js' // import secret from env to be used in the jwt.sign method

// Registration route
export const registerUser = async (req, res) => {
  try {
    console.log(req.body)
    const newUser = await User.create(req.body)
    console.log(newUser)
    return res.status(202).json({ message: 'Registration Successful' })
  } catch (err) {
    console.log(err)
    return res.status(422).json(err)
  }
}

// Login route
export const loginUser = async (req, res) => {
  try {
    // Destructure the req.body
    const { email, password } = req.body
    // Find a user by it's email - returns null if not found
    const userToLogin = await User.findOne({ email: email })
    // If not found or passwords don't match, return unauthorised status and text
    if (!userToLogin || !userToLogin.validatePassword(password)){
      return res.status(401).json({ message: 'Unauthorised' })
    }
    // If we get to this point - the user is validated, so we need to send them a token
    // the token will be used to authorise them when accessing secure routes
    // jwt.sign creates a token:
    // first argument is going to be our payload - this always needs a sub which identifies the user making the request - this needs to be unique so we'll use the _id
    // 
    const token = jwt.sign({ sub: userToLogin._id }, secret, { expiresIn: '7 days' })
    return res.status(200).json({ message: `Welcome back, ${userToLogin.username}`, token: token })
  } catch (err) {
    console.log(err)
    return res.status(401).json(err)
  }
}