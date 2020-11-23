class RemindersController < ApplicationController

    def create_botsettings
        @bot = Bot.find(params[:id])
        @reminder = Reminder.new(reminder: params[:botsettingsreminder][:reminder],bot_id: @bot.id, rebootconv: params[:date][:rebootconv])
        @reminder.save
        respond_to do |format|
            format.js
        end 
    end

    def update_botsettings
        @reminder = Reminder.find(params[:id])
        @bot = Bot.find(@reminder.bot_id)
        @reminder.update(reminder: params[:botsettingsupdatereminder][:reminder])
        respond_to do |format|
            format.js
        end 
    end

    def delete_botsettings
        @reminder = Reminder.find(params[:id])
        @bot = Bot.find(@reminder.bot_id)
        @reminder.destroy
        respond_to do |format|
            format.js
        end 
    end

end
