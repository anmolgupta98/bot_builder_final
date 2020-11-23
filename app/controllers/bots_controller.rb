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
       @bots = Bot.where(user_id: current_user.id)
    end
    
    def update
      @bot = Bot.find(params[:id])
      if params[:botsettingsphone]
         number = (params[:botsettingsphone][:phone]).to_i()
         @bot.update(phone: number)
         respond_to do |format|
            format.js
         end
      end  
      if params[:botsettingslanguage]
         if params[:button] == params[:botsettingslanguage][:English] 
            @bot.update(language: params[:botsettingslanguage][:English])
         elsif params[:button] == params[:botsettingslanguage][:Hindi] 
            @bot.update(language: params[:botsettingslanguage][:Hindi])
         elsif params[:button] == params[:botsettingslanguage][:Tamil] 
            @bot.update(language: params[:botsettingslanguage][:Tamil]) 
         end     
         respond_to do |format|
            format.js
         end
      end  
      if params[:botsettingsstarter]
         if params[:button] == params[:botsettingsstarter][:Customer] 
            @bot.update(initconv: params[:botsettingsstarter][:Customer])
         elsif  params[:button] == params[:botsettingsstarter][:Bot] 
            @bot.update(initconv: params[:botsettingsstarter][:Bot])
         end   
         respond_to do |format|
            format.js
         end
      end 
      if params[:botsettingstrigger]
         if params[:button] == params[:botsettingstrigger][:Default] 
            @bot.update(triggerpoint: params[:botsettingstrigger][:Default] )
            if Triggerphrase.where(bot_id: @bot.id)
               for phrase in Triggerphrase.where(bot_id: @bot.id)
                 phrase.destroy
               end   
            end   
         elsif  params[:button] == params[:botsettingstrigger][:Trigger] 
            @bot.update(triggerpoint: params[:botsettingstrigger][:Trigger] )
         end   
         respond_to do |format|
            format.js
         end
      end  

      if params[:setreminder]
         if params[:button] == params[:setreminder][:yes] 
            @bot.update(reminder: params[:setreminder][:yes] )   
         elsif  params[:button] == params[:setreminder][:no] 
            @bot.update(reminder: params[:setreminder][:no] )
            if Reminder.where(bot_id: @bot.id)
               for reminder in Reminder.where(bot_id: @bot.id)
                 reminder.destroy
               end   
            end   
         end   
         respond_to do |format|
            format.js
         end
      end  

      if params[:conversation]
         if params[:button] == params[:conversation][:open] 
            @bot.update(conversation: params[:conversation][:open] )   
         elsif  params[:button] == params[:conversation][:close] 
            @bot.update(conversation: params[:conversation][:close])
         end   
         respond_to do |format|
            format.js
         end
      end  
   
      if params[:botname]
         if @bot.update(params.require(:botname).permit(:name))
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

   def settings_change
      @bot = Bot.find(params[:id])
      if (params[:settings_change] == "1")
         respond_to do |format|
            format.js
         end
      end

      if (params[:settings_change] == "2")
         respond_to do |format|
            format.js
         end
      end

      if (params[:settings_change] == "3")
         respond_to do |format|
            format.js
         end
      end

      if (params[:settings_change] == "4")
         respond_to do |format|
            format.js
         end
      end

      if (params[:settings_change] == "5")
         respond_to do |format|
            format.js
         end
      end
      
      if (params[:settings_change] == "reminder")
         respond_to do |format|
            format.js
         end
      end

      if (params[:settings_change] == "anotherreminder")
         respond_to do |format|
            format.js
         end
      end

      if (params[:settings_change] == "skip")
         respond_to do |format|
            format.js
         end
      end
   end   

end

