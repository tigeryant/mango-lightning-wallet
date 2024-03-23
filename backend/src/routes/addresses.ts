const express = require('express');
const router = express.Router();
import { newAddress } from '../controllers/addressesController'

router.get('/new', newAddress);

export default router;