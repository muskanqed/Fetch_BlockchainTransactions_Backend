const mongoose = require('mongoose')
const {Schema,model} = mongoose

const blockTrackerSchema = new Schema({
    walletAddress: {
        type: String,
        unique: true,
        require: true
    },
    blockNumber: {
        type: String,
        require: true
    }
},{timestamps: true, strict: true})

blockTrackerSchema.index({walletAddress:'text'})

module.exports= model('Blocktracker', blockTrackerSchema)