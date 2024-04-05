const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    order: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
        }
    ]
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;