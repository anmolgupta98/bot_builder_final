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
            if params[:botsettings][:days] == "Everyday"
               @bot.update(starttime: params[:bots][:startime1])
               @bot.update(endtime:  params[:bots][:endtime1])
            elsif params[:botsettings][:days] == "Monday to Friday"
               @bot.update(starttime:  params[:bots][:startime2])
               @bot.update(endtime:  params[:bots][:endtime2])  
            elsif params[:botsettings][:days] == "Saturday and Sunday"
               @bot.update(starttime:  params[:bots][:startime3])
               @bot.update(endtime:  params[:bots][:endtime3])  
            else
               @bot.update(starttime:  params[:bots][:startime4])
               @bot.update(endtime:  params[:bots][:endtime4])  
               @bot.update(startdate:  params[:bots][:startdate4])        
               @bot.update(enddate:  params[:bots][:enddate4])   
            end
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
         end   
      end   
    end    

   def destroy
      @bot = Bot.find(params[:id])
      @bot.destroy
      redirect_to list_path
   end 

   def composemessage
      @bot = Bot.find(params[:id])
   end
   
   def activatebot
      @bot = Bot.find(params[:id])
   end

   def statistics
      @bot = Bot.find(params[:id]) 
   end   
   
   def list
     @bots = Bot.where(user_id: current_user.id)
   end   

   def test
      @bot = Bot.find(params[:id])
   end

end

