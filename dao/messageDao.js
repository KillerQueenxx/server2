const Message = require('./models/messageModel');

class MessageDao {
  async getAllMessages() {
    try {
      const messages = await Message.find();
      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
    }
  }

  
}

module.exports = MessageDao;
