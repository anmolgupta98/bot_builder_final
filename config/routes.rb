Rails.application.routes.draw do
  devise_for :users
  root 'bots#index'
  resources :bots, except: [:index]
  resources :triggerphrases, except: [:destroy, :create]
  resources :nodes, except: [:new, :update, :destroy]
  resources :messages, except: [:new, :create, :destroy]
  delete '/nodes/node_destroy/:id/:bot_id', to: 'nodes#destroy', as: 'node_destroy'
  get '/nodes/node_expand/:node_id/:bot_id', to: 'nodes#expand', as: 'node_expand'
  put '/nodes/node_update/:node_id/:bot_id', to: 'nodes#update', as: 'node_update'
  post '/messages/destroy_message/:node_id/:bot_id/:id', to: 'messages#destroy', as: 'messages_destroy'
  post '/messages/new_message/:node_id/:bot_id', to: 'messages#new', as: 'messages_new'
  get '/nodes/new/bot/:node_type/:bot_id/:parent_id', to: 'nodes#new', as: 'new_bot_node'
  get '/triggerphrases/create/:id', to: 'triggerphrases#create', as: 'triggerphrase_create'
  get '/triggerphrases/destroy/:id/:bot_id', to: 'triggerphrases#destroy', as: 'triggerphrase_destroy'
  get '/composemessage/:id', to: 'bots#composemessage', as: 'composemessage'
  get '/activatebot/:id', to: 'bots#activatebot', as: 'activatebot'
  get '/statistics/:id', to: 'bots#statistics', as: 'statistics'
  get '/test/:id', to: 'bots#test', as: 'test'
  get '/updateactive/:id', to: 'welcome#updateactive', as: 'updateactive'
end
