require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

const mongoose = require('mongoose')
const Contact = require('./model/Contact')

const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT || 3001

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("---- Connected to MongoDB Atlas ----")
  })
  .catch(error => {
    console.log('--- Error connecting to MongoDB Atlas ---')
    console.log(error)
  })

app.use((request, response, next) => {
  const reqInfo = `${request.method} request to ${request.originalUrl}`
  console.log(reqInfo)
  next()
})

app.get('/', (request, response) => {
  response.send('<h1>Welcome to Homepage!</h1>')
})

app.get('/api/contacts', (request, response) => {
  Contact
    .find({})
    .then(data => {
      response.json(data)
    })
    .catch(error => {
      console.log(`Can't fetch initial data from DB`)
      response.status(400).end()
    })
})

app.post('/api/contacts', (request, response) => {
  const data = request.body
  const newContact = new Contact({
    name: data.name,
    number: data.number
  })

  newContact.save()
    .then(savedContact => {
      console.log('Contact saved to MongoDB Atlas')
      response.json(savedContact)
      // mongoose.connection.close()
    })
    .catch(error => {
      console.log('Error saving contact to DB')
      console.log(error)
      response.status(400).end()
    })
})

// deleting data
app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id

    Contact
      .findByIdAndRemove({_id: id})
      .then(() => {
        console.log('Contact deleted successfully!')
        response.status(204).end()
      })
      .catch(error => {
        console.log('Error deleting contact')
        console.log(error)
        response.status(400).end()
      })
})

app.use((request, response) => {
    response.status(404).end('Link not available on website')
})

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})