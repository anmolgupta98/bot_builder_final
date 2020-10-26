Rails.application.routes.draw do
  devise_for :users
  root 'welcome#home'
  resources :bots
  get '/composemessage/:id', to: 'bots#composemessage', as: 'composemessage'
  get '/activatebot/:id', to: 'bots#activatebot', as: 'activatebot'
  get '/statistics/:id', to: 'bots#statistics', as: 'statistics'
  get '/list', to: 'bots#list'
  get '/test/:id', to: 'bots#test', as: 'test'
end
