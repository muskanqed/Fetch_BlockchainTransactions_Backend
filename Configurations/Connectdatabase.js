const mongoose = require('mongoose')
require('dotenv').config()
const databaseurl = process.env.DATABASE_URL || ''

const ConnectDataBase = async() => {
    try{
        await mongoose.connect(databaseurl, {
            useNewUrlParser: true,
            
    
        })
        console.log('MongoDB connected')
    }
    catch(error){
        console.error(error)
        process.exit(1)
        }

}
module.exports = ConnectDataBase