module.exports = (req, res, next) => {
    const { nickName, email, account_device_token } = req.body;

    if (!nickName || !email || !account_device_token) {
        return res.status(400).json({ error: 'nickName, email y account_device_token son requeridos' });
    }
    next();
};