This a chatbot builder made by Anmol Gupta and J. Sri Virinchi to help create chatbots.


<%= form_with scope: :botupdate, url: edit_bot_path(@bot.id), method: :post,  local: true do |f| %>
    <div class = "mt-4"><span style='font-size: 20px; color: rgb(230,230,230); margin: 0%; padding: 0%;'>&#9701;</span><span class = "rectangle triangle-left" style = "margin: 0%; padding: 0%;"> I use this phone number for conversation</span></div>
    <div class = "row mt-4" style = "margin-left: 6%;">
        <div class="col-1">
        <%= image_tag('symbol.png', size: "40", class: "rounded-circle")%>
        </div>
        <div class="col-11 mt-1">
        <div style = "color: grey">Business 1</div> 
        <div> +91 <%= @bot.phone%></div>
        </div>
    </div>
         <div class = " row ml-1">
          <div style='font-size: 20px; color: rgb(230,230,230);' class = "mt-3">&#9701;</div>
          <div class = "p-3 mb-1  mt-4  rectangle" >Select language to reply in</div>
        </div>
<% end %>    