const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
});

const CustomerSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fullName: { type: String, required: true },
    billingAddress: { type: String, required: true },
    shippingAddress: { type: String, required: true },
});

const InvoiceSchema = new mongoose.Schema({
    customerDetails: { type: CustomerSchema, required: true },
    products: { type: [ProductSchema], required: true },
    totalAmount: { type: Number, required: true },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);