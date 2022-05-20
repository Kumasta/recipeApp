import User from '../models/user.js' // Bring in the User model to query
import jwt from 'jsonwebtoken' // import jwt so we can use the jwt.verify method
import { secret } from './environment.js' // bring in secret to be used in jwt.verify


// This function is actually going to be middleware
// because it's middleware (defined in our router methods) we will have access to the req, res & next

export const secureRoute = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error('Missing header')
    const token = req.headers.authorization.replace('Bearer ', '')
    const payload = jwt.verify(token, secret)
    const userToVerify = await User.findById(payload.sub)
    if (!userToVerify) throw new Error('User not found')
    req.currentUser = userToVerify
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}