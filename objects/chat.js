const Database = require("./database");
const chat_model = require('../models/chat.js')
class Chat extends Database {
    constructor() {
        super();
    }

    async createChat(chatid){
        let chat = new chat_model({'chatid': chatid, 'messages': []});
        await chat.save();
    }

    async getMessages(chatid) {
        let chat = await this.showdb('chat',{'chatid': chatid});
        return chat;
    }
}

module.exports = Chat;