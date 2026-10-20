const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message to another user
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, productId } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver and message content',
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      product: productId || null,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role')
      .populate('product', 'name primaryImage price unit');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation history between logged in user and another user
// @route   GET /api/messages/conversation/:partnerId
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const currentUserId = req.user._id;

    // Fetch messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: partnerId },
        { sender: partnerId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role')
      .populate('product', 'name primaryImage price unit')
      .sort({ createdAt: 1 });

    // Mark messages as read where sender is partner and receiver is current user
    await Message.updateMany(
      { sender: partnerId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    const partner = await User.findById(partnerId).select('name avatar role phone farmerProfile');

    res.json({
      success: true,
      partner,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all conversations / contacts for logged in user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversationsList = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar role farmerProfile')
      .populate('receiver', 'name avatar role farmerProfile');

    const conversationMap = new Map();

    for (const msg of messages) {
      const partner =
        msg.sender._id.toString() === currentUserId.toString()
          ? msg.receiver
          : msg.sender;

      if (!partner) continue;

      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      // Count unread messages received by current user
      if (
        msg.receiver._id.toString() === currentUserId.toString() &&
        !msg.isRead
      ) {
        const item = conversationMap.get(partnerId);
        item.unreadCount += 1;
      }
    }

    const conversations = Array.from(conversationMap.values());

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};
