const Application = require("../models/Application");

const createApplication = async (req, res) => {
    try {
        const {
            companyName,
            role,
            appliedThrough,
            referrerName,
            portal,
            dateApplied,
            status,
            location,
            salary,
            jobPostingLink,
            notes
        } = req.body;

        // 1. Required field validation
        if (!companyName) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required"
            });
        }

        if (!appliedThrough) {
            return res.status(400).json({
                success: false,
                message: "Applied through is required"
            });
        }

        if (!dateApplied) {
            return res.status(400).json({
                success: false,
                message: "Application date is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Location is required"
            });
        }

        // 2. Create application
        const application = await Application.create({
            userId: req.user,
            companyName,
            role,
            appliedThrough,
            referrerName,
            portal,
            dateApplied,
            status,
            location,
            salary,
            jobPostingLink,
            notes
        });

        // 3. Return created application
        return res.status(201).json({
            success: true,
            message: "Application created successfully",
            application
        });

    } catch (error) {
        console.error("Create application error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            userId: req.user
        }).sort({
            dateApplied: -1
        });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get applications error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = {
    createApplication,
    getApplications
};