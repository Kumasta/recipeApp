import User from '../models/user.js' // importing the user model to query the users collection
import jwt from 'jsonwebtoken' // import jwt so we can create a token to send back during a successful login
import { secret } from '../config/environment.js' // import secret from env to be used in the jwt.sign method

// Registration route
export const registerUser = async (req, res) => {
  try {
    console.log(req.body)
    // log the register body
    const newUser = await User.create(req.body)
    // create new user from body
    console.log(newUser)
    // log new user document
    return res.status(202).json({ message: 'Registration Successful' })
    // return responce
  } catch (err) {
    console.log(err)
    return res.status(422).json(err)
  }
}


//login route
export const loginUser = async (req, res) => {
  try {
    //Destructure the rq.body
    const { email, password } = req.body
    // Find user by eamil
    const userToLogin = await User.findOne({ email: email })
    console.log(userToLogin)
    // If not found or password don't match. return unauthorised status and text
    if (!userToLogin || !userToLogin.validatePassword(password)) {
      return res.status(401).json({ message: 'Unauthorised' })
    }
    // If we get to this point - the user is validated, se we need to send them a token
    //the token will be used to authorise them when accessing scure routes
    //jwt.sign creats a token:
    // first arugment is going to be our payload - this always needs a sub which identifies the user making the request - this needs to be unique so we'll use the _id
    // 
    const token = jwt.sign({ sub: userToLogin._id }, secret, { expiresIn: '7 days' })
    console.log(token)
    return res.status(200).json({ message: `Welcome back, ${userToLogin.username}`, token: token })
  } catch (err) {
    console.log(err)
    return res.status(401).json(err)
  }
}