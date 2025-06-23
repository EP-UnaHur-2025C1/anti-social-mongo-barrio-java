try {
  const publicationsRoutes = require('./routes/publication');
  console.log('Módulo publication encontrado:', publicationsRoutes);
} catch (error) {
  console.error('Error al requerir el módulo publication:', error);
}