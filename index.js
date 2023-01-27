require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3
  },
  author: {
    type: String,
    required: true,
    minLength: 3
  },
  url: {
    type: String,
    required: true,
    minLength: 3
  },
  likes: {
    type: Number,
    required: true
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) =>  {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to database')
  })
  .catch(err => {
    console.log(err)
  })

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send('Home page')
})

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(err => console.log(err.message))
})

const PORT = process.env.PORT   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})