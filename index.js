const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('connected to database')
  })
  .catch(err => {
    logger.error(err)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

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
    .catch(err => logger.error(err.message))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = config.PORT   
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})