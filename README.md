This a chatbot builder made by Anmol Gupta and J. Sri Virinchi to help create chatbots.
            
               	<% i = 0 %>
				<%= collection_radio_buttons(:botsettingslanguage, :language, Language.all, :language, :language) do |b| %>
							<% if i < 3%>
								<span class="radio-toolbar mb-1 mr-4 mt-4 ml-3" style = "border-radius: 7px;">
									<%= b.radio_button  :remote => true, :onclick => "this.form.submit();" %> 
									<%= b.label(:"data-value" => b.value ,class: "shadow p-2 mb-4 text-center", style: "border-radius: 7px; border: solid 1px #d5d5d5;",  remote: true)%>
								</span>		
							<% end %>
							<% i = i+1 %>
						<% end %>
				<div class = "ml-0 mt-4">
						<% i = 0 %>
						<%= collection_radio_buttons(:botsettingsstarter, :initconv, ["Bot", "Customer"], :to_s, :to_s) do |b| %>
							<% if i < 2%>
								<span class="radio-toolbar mb-1 mr-4 mt-4 ml-3" style = "border-radius: 7px;">
									<%= b.radio_button :onclick => "this.form.submit();" %> 
									<%= b.label(:"data-value" => b.value ,class: "shadow p-2 mb-4 text-center", style: "border-radius: 7px; border: solid 1px #d5d5d5;")%>
								</span>		
							<% end %>
							<% i = i+1 %>
						<% end %>
					</div>
				<!--Reminder-->
				   <div class="mt-4 ml-0">	
							<%= f.radio_button :trigger , "Any keyword (Default bot)", :onclick => "this.form.submit();"  %>
							<%= f.label :trigger , "Any keyword (Default bot)", value: "Any keyword (Default bot)", class: "ml-2" %>
						</div>
						<div class="mt-2 ml-0">	
							<%= f.radio_button :trigger , "Specific keywords (Triggered bot)", :onclick => "this.form.submit();"  %>
							<%= f.label :trigger , "Specific keywords (Triggered bot)", value: "Specific keywords (Triggered bot)", class: "ml-2" %>
						</div>
				
				<!-- auto reboot -->
				<%# <div class="ml-3 mt-2 alert alert-warning">
					<p>Note:</p>
					<p>If user doesn’t reply in 
						
						minutes, bot will reboot the conversation</p>
				</div> %> 
				<!-- submit -->
				
			
		</div>					
    </div>	