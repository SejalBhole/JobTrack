const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            required: true,
            trim: true
        },

        appliedThrough: {
            type: String,
            required: true,
            enum: ["Referral", "Job Portal", "Company Website", "LinkedIn", "Other"],
            trim: true
        },

        referrerName: {
            type: String,
            trim: true
        },

        portal: {
            type: String,
            trim: true
        },

        dateApplied: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ["Applied", "Interview", "Selected", "Rejected", "Withdrawn"]
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        salary: {
            type: Number
        },

        jobPostingLink: {
            type: String,
            trim: true
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application;