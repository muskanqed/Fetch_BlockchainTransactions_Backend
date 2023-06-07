const mongoose = require('mongoose');
const {Schema,model} = mongoose

const transactionSchema = new Schema({
    walletAddress: {
        type: String
    },
    blockNumber: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    value: {
        type: String
    }
}, {timestamps: true ,strict: true})

transactionSchema.index({to: "text",from: "text"});

module.exports = model('Transactions', transactionSchema);