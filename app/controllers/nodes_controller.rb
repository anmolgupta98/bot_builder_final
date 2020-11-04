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
        @bot = Bot.find(params[:bot_id])
        @node = Node.find(params[:id])
        @node.destroy
        respond_to do |format|
            format.js
        end
    end  

    def update
       @node = Node.find(params[:node_id]) 
       @bot = Bot.find(params[:bot_id]) 
       @node.update(set_next_action: params[:set_next_action][:set_next_action], exit_message: params[:set_next_action][:exit_message])
       respond_to do |format|
            format.js
       end
    end    

    def expand
        @node = Node.find(params[:node_id]) 
        @bot = Bot.find(params[:bot_id]) 
        respond_to do |format|
             format.js
        end
    end    

end
