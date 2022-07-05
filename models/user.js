// Imports
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'


const { Schema } = mongoose

//Embbed schema of profile
const userProfile = new Schema({
  name: { type: String, default: '' },
  bio: { type: String, maxlength: 2000, default: '' },
  profilePicURL: { type: String, default: '' },
})

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  profile: userProfile,
}, {
  timestamps: true,
})

// Create a ownedRecipes virtualfield
userSchema.virtual('ownedRecipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'owner',
})

// Hide password in user document responce.
userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, json) {
    delete json.password
    return json
  },
})


// Creating our passwordConfirmation virtual field
userSchema
  .virtual('passwordConfirmation')
  .set(function (passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .pre('validate', function (next) {
    if (this.isModified('password') && this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Does not match password field.')
    }
    next()
  })

userSchema
  .pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    }
    next()
  })


// Unique validator
userSchema.plugin(uniqueValidator)

userSchema.methods.validatePassword = function (password) {
  console.log(password, this.password)
  return bcrypt.compareSync(password, this.password)
}

// Define and export our model
export default mongoose.model('User', userSchema)