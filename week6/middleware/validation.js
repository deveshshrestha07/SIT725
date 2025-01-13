const validateContent = (req, res, next) => {
    const { heading, description, picture } = req.body;

    // Check if fields exist and are not undefined
    if (!heading || !description || !picture) {
        return res.status(400).json({
            error: 'All fields are required (heading, description, picture)'
        });
    }

    // If validation passes, continue
    next();
};

module.exports = {
    validateContent
};