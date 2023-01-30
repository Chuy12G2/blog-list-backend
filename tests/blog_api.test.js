const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helpers')


beforeEach(async () => {
  await Blog.deleteMany({})
  let noteBlog = new Blog(helper.initialBlogs[0])
  await noteBlog.save()
  noteBlog = new Blog(helper.initialBlogs[1])
  await noteBlog.save()
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})

test('the first note is about the first blog being funny', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('First blog is funny')
})

test('verify that the blog contains the id property', async () => {
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
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1) 
})

test('delete a blog', async () => {
  const blogsAtStart = await helper.BlogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.BlogsInDb()
  
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(r => r.title)
  
  expect(contents).not.toContain(blogToDelete.title)
})

afterAll(async () => {
  await mongoose.connection.close()
})