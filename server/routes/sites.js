const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/SitesController');

//router.get('/search', sitesController.search);
router.get('/', sitesController.index);

module.exports = router;
