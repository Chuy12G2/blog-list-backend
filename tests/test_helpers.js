const Blog = require('../models/blog')

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

const BlogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, BlogsInDb
}