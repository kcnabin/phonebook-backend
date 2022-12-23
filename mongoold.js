const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://kcnabin:${password}@cluster0.9wk8l32.mongodb.net/noteApp?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// mongoose
//   .connect(url)
//   .then(result => {
//     console.log('Connected')

//     const note = new Note({
//       content: 'Callback functions are awesome!',
//       date: new Date(),
//       important: false,
//     })

//     return note.save()
//   })
//   .then((result) => {
//     console.log('note saved!')
//     return mongoose.connection.close()
//   })
//   .catch(error => console.log(error))

mongoose
  .connect(url)
  .then(result => {
    console.log('Connect to MongoDB Atlas')

    Note.find({important: true}).then(result => {
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })
  })