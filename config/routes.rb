Rails.application.routes.draw do
  devise_for :users
  root 'welcome#home'
  resources :bots
  get '/composemessage', to: 'bots#composemessage'
  get '/activatebot', to: 'bots#activatebot'
end
