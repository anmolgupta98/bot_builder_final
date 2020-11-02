class NodesController < ApplicationController

    def new
        @bot = Bot.find(params[:bot_id])    
        @node = Node.new(node_type: params[:node_type], bot_id: @bot.id, parent_id: params[:parent_id]) 
        @node.save
        respond_to do |format|
            format.js
        end  
    end
 
    def destroy
        @node = Node.find(params[:id])
        @node.destroy
        respond_to do |format|
            format.js
        end
    end  

end
