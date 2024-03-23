const express = require('express');
const router = express.Router();
import { test } from '../controllers/testController'

router.post('', test);

export default router;
