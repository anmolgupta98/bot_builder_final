class WelcomeController < ApplicationController
   def updateactive
		@bot = Bot.find(params[:id])
		  if @bot.status == "Active"
		    @bot.update(status: "Inactive")
		    respond_to do |format|
			   format.js
		  	end
		  else
		  	@bot.update(status: "Active")
		    respond_to do |format|
			   format.js
		  	end
		  end
	end

	def ckeditor_config
		
	end	

end
