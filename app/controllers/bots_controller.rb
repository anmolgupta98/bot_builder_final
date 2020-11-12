class BotsController < ApplicationController

    def index
       @bots = Bot.where(user_id: current_user.id)  
    end    

    def show

    end    

    def new
       @bot = Bot.new
    end
    
    def create
       @bot = Bot.new(params.require(:bot).permit(:name).merge(user_id: current_user.id))
       if @bot.save          
            redirect_to edit_bot_path(@bot.id)
       else
            flash[:alert]  = "A bot with same name already exists"
            redirect_to edit_bot_path(@bot.id)   
       end      
    end    

    def edit
       @bot = Bot.find(params[:id])
    end
    
    def update
      @bot = Bot.find(params[:id])
      if params[:botsettings]
         if @bot.update(params.require(:botsettings).permit(:language, :initconv, :triggerpoint, :days))
            @bot.update(params.require(:date).permit(:rebootconv)) 
            redirect_to composemessage_path 
         else
            flash[:alert] = "Couldn't save the bot details";
            redirect_to composemessage_path
         end 
      end
      if params[:botname]
         if @bot.update(params.require(:botname).permit(:name))
            flash.now[:notice] = "Name updated successfully"
            respond_to do |format|
               format.js
            end
         end   
      end   
    end    

   def destroy
      @bot = Bot.find(params[:id])
      @bot.destroy
      redirect_to root_path
   end 

   def composemessage
      @bot = Bot.find(params[:id])
      @node = Node.where(bot_id: @bot.id).first
   end
   
   def activatebot
      @bot = Bot.find(params[:id])
   end

   def statistics
      @bot = Bot.find(params[:id]) 
   end   
     
   def test
      @bot = Bot.find(params[:id])
   end

end

