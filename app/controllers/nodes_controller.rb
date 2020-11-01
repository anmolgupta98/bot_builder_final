class NodesController < ApplicationController

    def new
    @node = Node.new(node_type: params[:node_type], bot_id: params[:bot_id], parent_id: params[:parent_id]) 
    @node.save
    respond_to do |format|
        format.js
    end  
    end
 

end
