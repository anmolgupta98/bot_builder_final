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
        @node = nil
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
    
    def add_child_nodes
        @node = Node.find(params[:node_id])
        @bot = Bot.find(params[:bot_id])
        child_nodes = (params[:number_of_nodes][:number]).to_i
        for i in (1..child_nodes)
            @new_node = Node.create(parent_id: @node.id, bot_id: @bot.id, node_type: "user") 
        end    
        respond_to do |format| 
            format.js
        end 
    end    

    def plus
        @node = Node.find(params[:node_id]) 
        @bot = Bot.find(params[:bot_id]) 
		respond_to do |format|
		    format.js
	  	end
    end 
    
    def minus
        @node = Node.find(params[:node_id]) 
        @bot = Bot.find(params[:bot_id]) 
		respond_to do |format|
		    format.js
	  	end
    end   
    
    def delete_child_nodes
        @node = Node.find(params[:id])
        @parent = Node.find(params[:parent_id])
        @bot = Bot.find(params[:bot_id])
        @parent_id = @node.parent_id
        @node.destroy
        @node = Node.find(@parent_id)
        @number_of_children = 0 

        for i in @node.children
            @number_of_children = @number_of_children + 1
        end

        respond_to do |format|
           format.js
        end
    end  

    def define_child_node
        @child = Node.find(params[:id])
        @parent = @child.parent_id
        respond_to do |format|
            format.js
        end
    end    

    def user_name_update
        @child = Node.find(params[:id]) 
        @child.update(name: params[:childname][:name])
        respond_to do |format|
            format.js
        end 
    end     

    def user_name_edit_icon_click
        @child = Node.find(params[:id]) 
        respond_to do |format|
            format.js
        end 
    end    
end
