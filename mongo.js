const mongoose = require('mongoose')

const password = process.argv[2]


const uName = process.argv[3]
const uNumber = process.argv[4]


const url = `mongodb+srv://kcnabin:${password}@cluster0.9wk8l32.mongodb.net/phonebook?retryWrites=true&w=majority`

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (uName && uNumber) {
    console.log('Both name and number are defined')
  
    mongoose
        .connect(url)
        .then(result => {
            console.log('Connected to Atlas')

            const newContact = new Contact({
                name: `${uName}`,
                number: `${uNumber}`,
            })

            return newContact.save()
    
        })
        .then(result => {
            // console.log(result)
            console.log(`added ${uName} number ${uNumber} to phonebook`)
            mongoose.connection.close()
        })
        .catch(error => {
            console.log('Error! ', error)
        })

} else {
    mongoose
        .connect(url)
        .then(result => {
            console.log('Welcome to Atlas!')

            Contact
                .find({})
                .then(result => {
                    console.log('Phonebook:')
                    result.forEach(eachContact => {
                        console.log(eachContact.name, ' ', eachContact.number)
                    })

                    mongoose.connection.close()

                })
        })
        .catch(error => {
            console.log('Error! ', error)
        })
}


