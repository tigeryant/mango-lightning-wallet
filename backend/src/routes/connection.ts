const express = require('express');
const router = express.Router();
import { connect } from '../controllers/connectionController'

router.post('', connect);

export default router;
