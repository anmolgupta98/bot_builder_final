class MessagesController < ApplicationController

    def new
        @bot = Bot.find(params[:bot_id])    
        @node = Node.find(params[:node_id])
        @ckeditorid = "ckeditor" + @node.id.to_s() 
        @message = Message.new(params.require(:text_messages).permit(:text_message, :message_type).merge(bot_id: @bot.id, node_id: @node.id, node_type: "bot"))
        @message.save
        respond_to do |format|
            format.js
        end  
    end

    def edit
        @message = Message.find(params[:id])
        @bot = Bot.find(params[:bot_id])    
        @node = Node.find(params[:node_id])
        @message.update(text_message: params[:previous_text_messages][:text_message])
        respond_to do |format|
            format.js
        end  
    end

    def edit_click
        @message = Message.find(params[:id])
        @bot = Bot.find(params[:bot_id])    
        @node = Node.find(params[:node_id])
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

    def user_child_node_new_message
        @child = Node.find(params[:id])
        @bot_id = @child.bot_id
        @bot = Bot.find(@bot_id)
        @id = @child.parent_id
        @node = Node.find(@id)
        @message = Message.new(params.require(:messages).permit(:text_message).merge(bot_id: @bot.id, node_id: @child.id, node_type: "user"))
        @message.save
        respond_to do |format|
          format.js
        end
    end    

    def user_child_delete_message
        @message = Message.find(params[:id])
        @bot = Bot.find(@message.bot_id)
        @child = Node.find(@message.node_id)
        @node = @child.parent_id
        @message.destroy
        respond_to do |format|
           format.js
        end   
    end    
end
