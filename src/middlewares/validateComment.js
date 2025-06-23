module.exports = (req, res, next) => {
    const { text, postId, userId } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0){
        return res.status(400).json({ error: '⛔ El comentario no puede estar vacío '});
    }

    if (!postId || isNaN(postId)){
        return res.status(400).json({ error: '⛔ El postId es requerido y debe ser un número válido'});
    } 

    if (!userId || isNaN(userId)){
        return res.status(400).json({ error: '⛔ El userId es requerido y debe ser un número válido'});
    }

    next();
};