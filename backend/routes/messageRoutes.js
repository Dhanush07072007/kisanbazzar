const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversationsList,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversationsList);
router.get('/conversation/:partnerId', getConversation);

module.exports = router;
