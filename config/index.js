require('dotenv').config()

const supertest = require('supertest')
const request = supertest(process.env.API_URL)
const expect = require('chai').expect

module.exports = {
  request,
  expect
}
