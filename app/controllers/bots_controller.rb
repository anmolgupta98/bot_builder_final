class BotsController < ApplicationController

    def index

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
      if @bot.update(params.require(:botsettings).permit(:language, :initconv, :triggerpoint, :days))
         if params[:botsettings][:days] == "Everyday"
            @bot.update(starttime: params[:bots][:startime_1])
            @bot.update(endtime:  params[:bots][:endtime_1])
         elsif params[:botsettings][:days] == "Monday to Friday"
            @bot.update(starttime:  params[:bots][:startime_2])
            @bot.update(endtime:  params[:bots][:endtime_2])  
         elsif params[:botsettings][:days] == "Saturday and Sunday"
            @bot.update(starttime:  params[:bots][:startime_3])
            @bot.update(endtime:  params[:bots][:endtime_3])  
         else
            @bot.update(starttime:  params[:bots][:startime_4])
            @bot.update(endtime:  params[:bots][:endtime_4])  
            @bot.update(startdate:  params[:bots][:startdate_4])        
            @bot.update(enddate:  params[:bots][:enddate_4])   
         end
         @bot.update(params.require(:date).permit(:rebootconv)) 
         redirect_to composemessage_path 
      else
         flash[:alert] = "Couldn't save the bot details";
         redirect_to composemessage_path
      end 
    end    

   def composemessage
      @bot = Bot.where( user_id: current_user.id).last
   end
   
   def activatebot
      @bot = Bot.where( user_id: current_user.id).last
   end

end

