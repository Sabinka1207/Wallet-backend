const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/statistics');
const { yearMonthValidation } = require('../../middlewares/statistics');

router.get('/', yearMonthValidation, controllers.getStatistics);

module.exports = router;
