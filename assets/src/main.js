const express = require('express');
const app = express();
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();


const PORT = process.env.PORT || 3005;
const db = require('./db/models');

const usersRoutes = require('./routes/user');
const postsRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const tagRoutes = require('./routes/tag');
const imageRouter = require('./routes/image');
const healthRoutes = require('./routes/health');
const contactRoutes = require('./routes/contact');
const accessRoutes = require('./routes/access');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api-docs', swaggerUI.serve,  swaggerUI.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas
app.use('/user', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/comment', commentRoutes);
app.use(errorHandler);
app.use('/tags', tagRoutes);
app.use('/images', imageRouter);
app.use('/api/health', healthRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/accesses', accessRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

