module.exports = function (req, res, next) {
    const { name } = req.body;

    if(!name || typeof name !== 'string' || name.trim() === ''){
        return res.status(400).json({ error: 'El nombre del tag es obligatorio' });
    }
    next();
};