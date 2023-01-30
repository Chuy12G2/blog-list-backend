const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
  {
    "title": "First blog is funny",
    "author": "Peter",
    "url": "www.blog1.com",
    "likes": 524
  },
  {
    "title": "Second Blog is interesting",
    "author": "John",
    "url": "www.blog2.com",
    "likes": 121
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteBlog = new Blog(initialBlogs[0])
  await noteBlog.save()
  noteBlog = new Blog(initialBlogs[1])
  await noteBlog.save()
})

test.skip('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('content-Type', /application\/json/)
})

test.skip('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})

test.skip('the first note is about the first blog being funny', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('First blog is funny')
})

test.skip('verify that the blog contains the id property', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('verify that making an HTTP POST createsa new blog', async () => {
  const newBlog = {
    "title": "Third Blog is interesting",
    "author": "Barack",
    "url": "www.blog3.com",
    "likes": 111
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1) 
})

afterAll(async () => {
  await mongoose.connection.close()
})