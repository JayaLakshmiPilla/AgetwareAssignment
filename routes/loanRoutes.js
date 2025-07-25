const router = require('express').Router();
const controller = require('../controllers/loanController');

router.post('/', controller.createLoan);
router.post('/:loan_id/payments', controller.addPayment);
router.get('/:loan_id/ledger', controller.getLedger);

module.exports = router;
