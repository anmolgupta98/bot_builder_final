Rails.application.routes.draw do
  root 'bots#index'
  resources :bots, except: [:index]
end
