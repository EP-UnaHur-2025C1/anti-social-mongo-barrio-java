const fs = require('fs');
const path = require('path');
const { Post } = require('../db/models');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

exports.uploadImage = async (req, res) => {
    try{
        if(!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo'});
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(201).json({ mensaje: 'Imagen subida correctamente', imageUrl}); 
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getImage = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Image no encontrada' });
        }
        res.sendFile(filePath);
    });
};

exports.deleteImage = async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    fs.unlink(filePath, async (err) => {
        if (err) {
            return res.status(404).json({ error: 'Imagen no encontrada o ya eliminada' });
        }

        try{
            const post = await Post.findOne({ where: { imageUrl: `/uploads/${filename}`}});
            
            if (post){
                post.imageUrl = null;
                await post.save();
            }
            res.json({ mensaje: 'Imagen eliminada correctamente' });
        }catch(error){
            console.error('Error al actualizar el post:', error);
            res.status(500).json({error: 'Error interno al limpiar referencia del post'});
        }
    });
};


exports.upload = upload;