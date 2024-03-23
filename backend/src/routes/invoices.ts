const express = require('express');
const router = express.Router();
import { getInvoice, payInvoice } from '../controllers/invoicesController'

router.post('/get', getInvoice);
router.post('/pay', payInvoice);

export default router;
