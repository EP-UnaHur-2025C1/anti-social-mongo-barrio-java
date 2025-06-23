module.exports = (req, res, next) => {
    const text = req.body.text || req.body.postContent;
    if (!text || text.trim() === '') {
        return res.status(400).json({error: 'El contenido del post no puede estar vacío.'});
    }

    if (req.file) {
        if (!req.file.mimetype.startsWith("image/")) {
            return res.status(400).json({error: "El archivo debe ser una imagen."});
        }
        if (req.file.size === 0) {
            return res.status(400).json({error: "El archivo de imagen está vacío."});
        }
    }

    next();
};