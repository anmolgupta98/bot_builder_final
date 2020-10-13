Rails.application.routes.draw do
  devise_for :users
  root 'bots#index'
  resources :bots, except: [:index]
end
