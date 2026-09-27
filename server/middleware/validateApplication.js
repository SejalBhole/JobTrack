const validateApplication = (req, res, next) => {
    const {
        companyName,
        role,
        appliedThrough,
        referrerName,
        portal,
        dateApplied,
        status,
        location
    } = req.body;

    // Company name validation
    if (!companyName) {
        return res.status(400).json({
            success: false,
            message: "Company name is required"
        });
    }

    // Role validation
    if (!role) {
        return res.status(400).json({
            success: false,
            message: "Role is required"
        });
    }

    // Applied through validation
    if (!appliedThrough) {
        return res.status(400).json({
            success: false,
            message: "Applied through is required"
        });
    }

    // Allowed applied-through values
    const allowedSources = [
        "Referral",
        "Job Portal",
        "Company Website",
        "LinkedIn",
        "Other"
    ];

    if (!allowedSources.includes(appliedThrough)) {
        return res.status(400).json({
            success: false,
            message: "Invalid applied through value"
        });
    }

    // Referral validation
    if (appliedThrough === "Referral" && !referrerName) {
        return res.status(400).json({
            success: false,
            message: "Referrer name is required for referral applications"
        });
    }

    // Job Portal validation
    if (appliedThrough === "Job Portal" && !portal) {
        return res.status(400).json({
            success: false,
            message: "Portal is required for job portal applications"
        });
    }

    // Date validation
    if (!dateApplied) {
        return res.status(400).json({
            success: false,
            message: "Application date is required"
        });
    }

    // Status validation
    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status is required"
        });
    }

    // Allowed status values
    const allowedStatuses = [
        "Applied",
        "Interview",
        "Selected",
        "Rejected",
        "Withdrawn"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value"
        });
    }

    // Location validation
    if (!location) {
        return res.status(400).json({
            success: false,
            message: "Location is required"
        });
    }

    // Everything is valid
    next();
};

module.exports = validateApplication;