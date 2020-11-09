Rails.application.routes.draw do
  devise_for :users
  root 'bots#index'
  resources :bots, except: [:index]
  resources :triggerphrases, except: [:destroy, :create]
  resources :nodes, except: [:new, :update, :destroy]
  resources :messages, except: [:new, :create, :destroy]
  get '/nodes/user_child_node_compressed_expand/:id', to: 'nodes#user_child_node_compressed_expand', as: 'user_child_node_compressed_expand'
  delete '/nodes/user_child_node_compressed_delete/:id', to: 'nodes#user_child_node_compressed_delete', as: 'user_child_node_compressed_delete'
  post '/nodes/user_child_node_settings/:id', to: 'nodes#user_child_node_settings', as: 'user_child_node_settings'
  delete '/nodes/user_child_node_delete/:id', to: 'nodes#user_child_node_delete', as: 'user_child_node_delete'
  get '/nodes/user_child_node_name_edit_icon_click/:id', to: 'nodes#user_child_node_name_edit_icon_click', as: 'user_child_node_name_edit_icon_click'
  post '/nodes/user_child_node_name_update/:id', to: 'nodes#user_child_node_name_update', as: 'user_child_node_name_update'
  get '/nodes/define_child_node/:id', to: 'nodes#define_child_node', as: 'define_child_node'
  delete '/nodes/child/:id/:parent_id/:bot_id', to: 'nodes#delete_child_nodes', as: 'delete_child_nodes'
  post '/nodes/child_nodes/:node_id/:bot_id', to: 'nodes#add_child_nodes', as: 'add_child_nodes'
  get '/nodes/child_plus/:node_id/:bot_id', to: 'nodes#plus', as: 'node_plus'
  get '/nodes/child_minus/:node_id/:bot_id', to: 'nodes#minus', as: 'node_minus'
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
