const express = require('express');
const router = express.Router();
import { getInfo, getNodeInfo } from '../controllers/infoController'

router.get('', getInfo);
router.get('/node', getNodeInfo);

export default router;
