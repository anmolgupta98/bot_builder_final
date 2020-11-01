Rails.application.routes.draw do
  devise_for :users
  root 'bots#index'
  resources :bots, except: [:index]
  resources :triggerphrases, except: [:destroy, :create]
  resources :nodes, except: [:new]
  get '/new/:node_type/:bot_id/:parent_id', to: 'nodes#new', as: 'new'
  get '/create/:id', to: 'triggerphrases#create', as: 'create'
  get '/destroy/:id/:bot_id', to: 'triggerphrases#destroy', as: 'destroy'
  get '/composemessage/:id', to: 'bots#composemessage', as: 'composemessage'
  get '/activatebot/:id', to: 'bots#activatebot', as: 'activatebot'
  get '/statistics/:id', to: 'bots#statistics', as: 'statistics'
  get '/list', to: 'bots#list'
  get '/test/:id', to: 'bots#test', as: 'test'
  get '/updateactive/:id', to: 'welcome#updateactive', as: 'updateactive'
end
