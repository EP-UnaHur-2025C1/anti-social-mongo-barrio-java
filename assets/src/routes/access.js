const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');
const validateAccess = require('../middlewares/validateAccess');

router.post('/', validateAccess, accessController.createAccess);
router.get('/', accessController.getAccesses);
router.get('/:id', accessController.getAccess);
router.put('/:id', validateAccess, accessController.updateAccess);
router.delete('/:id', accessController.deleteAccess);

module.exports = router;
