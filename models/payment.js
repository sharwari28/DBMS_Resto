const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;