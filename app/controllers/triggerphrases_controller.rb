class TriggerphrasesController < ApplicationController

   def new

   end

   def create
    @bot = Bot.find(params[:id])
    @triggerphrase = Triggerphrase.new(params.require(:triggerform).permit(:trigger).merge(bot_id: @bot.id))
    @triggerphrase.save
    respond_to do |format|
        format.js
    end
   end
   
   def edit
    @bot = Bot.find(params[:id])
    respond_to do |format|
        format.js
    end
   end
   
    def update
        @bot = Bot.find(params[:id])
        respond_to do |format|
            format.js
        end
    end
   
    def destroy
        @bot = Bot.find(params[:bot_id])
        @trigger= Triggerphrase.find(params[:id])
        @trigger.destroy
        respond_to do |format|
            format.js
        end
    end

    def destroy_botsettings  
        @trigger= Triggerphrase.find(params[:id])
        @bot = Bot.find(@trigger.bot_id)
        @trigger.destroy
        respond_to do |format|
            format.js
        end
    end     

    def create_botsettings
        @bot = Bot.find(params[:id])
        @triggerphrase = Triggerphrase.new(params.require(:triggerform).permit(:trigger).merge(bot_id: @bot.id))
        @triggerphrase.save
        respond_to do |format|
            format.js
        end
    end

end
