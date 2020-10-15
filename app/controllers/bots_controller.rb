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

    end  
end

