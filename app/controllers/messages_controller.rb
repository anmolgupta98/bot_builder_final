class MessagesController < ApplicationController

    def new
        @bot = Bot.find(params[:bot_id])    
        @node = Node.find(params[:node_id])
        @message = Message.new(params.require(:text_messages).permit(:text_message).merge(bot_id: @bot.id, node_id: @node.id))
        @message.save
        respond_to do |format|
            format.js
        end  
    end
    
    def destroy
        @message = Message.find(params[:id])
        @bot = Bot.find(params[:bot_id])
        @node = Node.find(params[:node_id])
        @message.destroy
        respond_to do |format|
            format.js
        end 
     end 

end
