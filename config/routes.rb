Rails.application.routes.draw do
  devise_for :users
  root 'bots#index'
  resources :bots, except: [:index]
  get '/composemessage/:id', to: 'bots#composemessage', as: 'composemessage'
  get '/activatebot/:id', to: 'bots#activatebot', as: 'activatebot'
  get '/statistics/:id', to: 'bots#statistics', as: 'statistics'
  get '/list', to: 'bots#list'
  get '/test/:id', to: 'bots#test', as: 'test'
  get '/updateactive/:id', to: 'welcome#updateactive', as: 'updateactive'
end
