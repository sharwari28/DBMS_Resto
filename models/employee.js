const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;