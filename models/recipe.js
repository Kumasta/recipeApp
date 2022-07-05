import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'


const { Schema } = mongoose


//Embbed Rating Schema
const RecipeRatingSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
})


///Likes
const likeSchema = new Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  like: { type: Boolean, default: false }, //?? Change likes to like in the key
})

///Comment
const commentSchema = new Schema({
  text: { type: String, required: true, maxlength: 300 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  likes: [likeSchema],
}, {
  timestamps: true,
})


const RecipeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, maxlength: 500 },
  type: {
    type: String, enum: [
      'vegan',
      'vegiterian',
      'episcoterian',
      'alcohol',
      'non-alcoholic',
      'keto-friendly',
      'halal'
    ],
  },
  alergens: [{
    type: String, enum: [
      'gluten',
      'crustaceans',
      'eggs',
      'fish',
      'peanuts',
      'soybeans',
      'dairy',
      'nuts',
      'celery',
      'mustard',
      'sesame seeds',
      'sulphur dioxide and sulphites',
      'lupin',
      'molluscs'
    ],
  }],
  cuisineType: {
    type: String, enum: [
      'American',
      'Asian',
      'British',
      'Caribbean',
      'Central Europe',
      'Chinese',
      'Eastern Europe',
      'French',
      'Indian',
      'Italian',
      'Japanese',
      'Kosher',
      'Mediterranean',
      'Mexican',
      'Middle Eastern',
      'Nordic',
      'South American',
      'South East Asian',
      'African',
      'North Arfican'
    ],
  },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
  ratings: [RecipeRatingSchema],
  tags: [{ type: String }],
}, {
  timestamps: true,
})

RecipeSchema.virtual('avgRating')
  .get(function () {
    if (!this.ratings.length) return 'Not rated yet'
    const sum = this.ratings.reduce((acc, score) => {
      return acc + score.rating
    }, 0)
    return (sum / this.ratings.length).toFixed(2)
  })

commentSchema.virtual('sumOfLikes')
  .get(function () {
    if (!this.likes.length) return 'Not rated yet'
    return this.likes.length
  })

RecipeSchema.set('toJSON', {
  virtuals: true,
})

commentSchema.set('toJSON', {
  virtuals: true,
})

RecipeRatingSchema.set('toJSON', {
  virtuals: true,
})

// Plugins
RecipeSchema.plugin(uniqueValidator)

export default mongoose.model('Recipe', RecipeSchema)