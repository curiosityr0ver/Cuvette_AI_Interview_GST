const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fullName: { type: String, required: true },
    linkedin: { type: String },
    technologies: { type: [String], required: true },
    jobProfile: { type: String, required: true },
});

// technologies,
// jobProfile

module.exports = mongoose.model('User', UserSchema);
