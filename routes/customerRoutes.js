const router = require('express').Router();
const controller = require('../controllers/loanController');

router.get('/:customer_id/overview', controller.customerOverview);

module.exports = router;
