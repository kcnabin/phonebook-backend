const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

const mongoose = require('mongoose')
const password = 'ilovemongodb'
const url = `mongodb+srv://kcnabin:${password}@cluster0.9wk8l32.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

app.use((request, response, next) => {
    const reqInfo = `${request.method} request to ${request.originalUrl}`
    console.log(reqInfo)
    // console.log(request)

    next()
})

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Homepage!</h1>')
})

app.get('/api/contacts', (request, response) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('Connect to MongoDB Atlas')

      Contact
        .find({})
        .then(data => {
          response.json(data)
          mongoose.connection.close()
        })
        .catch(error => {
          console.log('Error accessing... ', error)
        })
    })
    .catch(error => {
      console.log('Error connecting..', error)
    })
})

app.post('/api/contacts', (request, response) => {
  const data = request.body

  mongoose
    .connect(url)
    .then(() => {
      const newContact = new Contact({
        name: data.name,
        number: data.number
      })
    
      return newContact.save()
    })
    .then(returnedData => {
      console.log('Contact saved to MongoDB Atlas')
      response.json(returnedData)
      mongoose.connection.close()
    })
    .catch(error => {
      console.log('Error connecting...', error)
    })
})

// let contacts = [
//     { 
//         'id': 1,
//         'name': 'Nabaraj KC', 
//         'number': '9849223125'
//     },
//     { 
//         'id': 2,
//         'name': 'Deuka KC', 
//         'number': '9849917398'
//     },
//     { 
//         'id': 3,
//         'name': 'Nabin KC', 
//         'number': '9861813448'
//     }
// ]

// app.get('/api/persons', (request, response) => {
//     // response.json(contacts)

//     Contact
//         .find({})
//         .then(notes => {
//             response.json(notes)
//         })
// })

// app.get('/info', (request, response) => {
//   let totalContacts = contacts.length
//   let date = new Date()
//   let info = `Phonebook has info for ${totalContacts} people.
//               <br>
//               ${date}
//               `
//   response.send(info)
// })

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = contacts.find(contact => contact.id === id)

//     if (person) {
//         return response.json(person)
//     } else {
//         return response.status(404).end('Contact not found')
//     }
  
// })

// deleting data
// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     contacts = contacts.filter(contact => contact.id !== id)
//     response.status(204).end()
// })

// const generateId = () => {
//     let maxId = contacts.length > 0 
//         ? Math.max(...contacts.map(contact => contact.id))
//         : 0
//     return maxId + 1
// }

// adding new data
// app.post('/api/contacts',(request, response) => {
//     const data = request.body

//     if (!data.name || !data.number) {
//         return response.status(400).end('Need both name and number')
//     }

//     const allNames = contacts.map(contact => contact.name)
//     // console.log(allNames)
//     let alreadyAdded = allNames.includes(data.name)

//     if (alreadyAdded) {
//         return response.status(400).end('Can\'t add same person twice')
//     }

//     data.id = generateId()
//     contacts = contacts.concat(data)

//     response.json(data)
// })

app.use((request, response) => {
    response.status(404).end('Link not available on website')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})