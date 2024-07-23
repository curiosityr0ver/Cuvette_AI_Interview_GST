const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    institutionName: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: function () { return this.type === 'College'; }
    },
    fieldOfStudy: {
        type: String,
        required: function () { return this.type === 'College'; }
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isCurrentlyEnrolled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['School', 'College'],
        required: true
    }
});

const experienceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    isCurrentlyWorking: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
});

const socialSchema = new mongoose.Schema({
    linkedIn: {
        type: String,
        required: true
    },
    github: {
        type: String,
        required: true
    },
});

const resumeSchema = new mongoose.Schema({
    personalInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: String,
    },
    education: [educationSchema],
    experience: [experienceSchema],
    social: socialSchema,
    technologies: {
        type: [String],
        enum: ["React", "Node", "SQL", "ExpressJS", "DevOps", "ML", "DataScience"],
        required: true,
    },
    jobProfile: {
        type: String,
        enum: ["Frontend Developer", "FullStack Developer", "Backend Developer", "Devops Engineer", "Data Scientist"],
        required: true,
    },
}, { timestamps: true });





const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
