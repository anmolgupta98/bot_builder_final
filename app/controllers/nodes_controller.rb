class NodesController < ApplicationController

    def new
        @bot = Bot.find(params[:bot_id])    
        @node = Node.new(node_type: params[:node_type], bot_id: @bot.id, parent_id: params[:parent_id]) 
        @parent = params[:parent_id]
        @node.save
        @node = Node.where(bot_id: @bot.id, parent_id: params[:parent_id]).first   
        respond_to do |format|
            format.js
        end  
    end
 
    def destroy
        @bot = Bot.find(params[:bot_id])
        @node = Node.find(params[:id])
        @id = @node.id
        @parent = @node.parent_id
        @node.destroy
        @node = nil
        respond_to do |format|
            format.js
        end
    end  

    def update
        @node = Node.find(params[:node_id]) 
        @bot = Bot.find(params[:bot_id]) 
        @parent = params[:set_next_action][:parent_id]
        @node.update(set_next_action: params[:set_next_action][:set_next_action], exit_message: params[:set_next_action][:exit_message], transfer_message: params[:set_next_action][:transfer_message])
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
            @new_node.update(name: "Message from Customer" )
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

    def user_child_node_name_update
        @child = Node.find(params[:id]) 
        @child.update(name: params[:childname][:name])
        respond_to do |format|
            format.js
        end 
    end     

    def user_child_node_name_edit_icon_click
        @child = Node.find(params[:id]) 
        respond_to do |format|
            format.js
        end 
    end    

    def user_child_node_delete
        @child = Node.find(params[:id])
        @bot_id = @child.bot_id
        @bot = Bot.find(@bot_id)
        @id = @child.parent_id
        @node = Node.find(@id)
        @child.destroy
        respond_to do |format|
            format.js
        end 
    end    

    def user_child_node_settings
        @child = Node.find(params[:id])
        @id = @child.parent_id
        @node = Node.find(@id)
        @bot_id = @child.bot_id
        @bot = Bot.find(@bot_id)
        @child.update(user_input_type: params[:userchildnodesettings][:user_input_type])
        respond_to do |format|
            format.js
        end   
    end    

    def user_child_node_compressed_delete
        @child = Node.find(params[:id])
        @bot_id = @child.bot_id
        @bot = Bot.find(@bot_id)
        @id = @child.parent_id
        @node = Node.find(@id)
        @child.destroy
        respond_to do |format|
            format.js
        end  
    end   
    
    def user_child_node_compressed_expand
        @child = Node.find(params[:id])
        @bot_id = @child.bot_id
        @bot = Bot.find(@bot_id)
        @id = @child.parent_id
        @node = Node.find(@id)
        respond_to do |format|
            format.js
        end  
    end    

    def exit_message_toggle_switch
        @node = Node.find(params[:id])
        @bot  = Bot.find(@node.bot_id)
        if @node.exit_message_toggle_switch == true
            @node.update(exit_message_toggle_switch: false)
            respond_to do |format|
             format.js
            end
        else
            @node.update(exit_message_toggle_switch: true)
            respond_to do |format|
             format.js
            end
        end
    end   
    
    def transfer_message_toggle_switch
        @node = Node.find(params[:id])
        @bot  = Bot.find(@node.bot_id)
        if @node.transfer_message_toggle_switch == true
            @node.update(transfer_message_toggle_switch: false)
            respond_to do |format|
             format.js
            end
        else
            @node.update(transfer_message_toggle_switch: true)
            respond_to do |format|
             format.js
            end
        end
    end    

    def bot_node_name
       @node = Node.find(params[:id])
       @node.update(name: params[:botname][:name])
       respond_to do |format|
            format.js
       end
    end

    def bot_node_name_edit_icon_click
        @node = Node.find(params[:id])
        respond_to do |format|
             format.js
        end
    end

    def nodes_message_attach_media
		@node = Node.find(params[:attach_message][:node_id])
		@bot = Bot.find(@node.bot_id)
		@parent_id = @node.parent_id
		@message = Message.create(params.require(:attach_message).permit(:image, :node_id, :node_type, :bot_id, :message_type))
		respond_to do |format|
		    format.js
        end
    end      

end
