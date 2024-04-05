const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Customer'
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
            
        }
    ],
    total: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;