Foundry::Application.routes.draw do

  resources :landings

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

 
  get "welcome/index"
  
  root 'welcome#index'

  get 'oauth2callback' => 'welcome#index'
  get '/flash_teams/event_library' => 'flash_teams#event_library'
  get '/flash_teams/event_search' => 'flash_teams#event_search'
  post '/flash_teams/rename' => 'flash_teams#rename'

  resources :flash_teams do
    member do 
      delete :destroy
      get :get_status
      post :update_status
      post :update_original_status
      post :update_json
      get :get_json
      post :early_completion_email
      post :get_user_name
      post :get_team_info
      post :delayed_task_finished_email
      post :create
      post :send_edit_team_request
      #get :hire_form
      get :task_portal
      get :settings
      get :duplicate
      get :clone
      post :settings
    end
  end

  get '/flash_teams/:id/:event_id/hire_form' => 'flash_teams#hire_form'

  get '/flash_teams/:id/:event_id/hire_form/task_rejection' => 'flash_teams#task_rejection'
  get '/flash_teams/:id/:event_id/hire_form/task_acceptance' => 'flash_teams#task_acceptance'
  get '/landings/:id/:event_id/view' => 'landings#view'
  post '/flash_teams/:id/:event_id/listQueue' => 'flash_teams#listQueue'
get '/flash_teams/:id/:event_id/listQueueForm' => 'flash_teams#listQueueForm'

  get '/landings/:id/:event_id/remove' => 'landings#remove'
  post '/flash_teams/:id/:event_id/hire_form/send_task_acceptance' => 'flash_teams#send_task_acceptance'
  post '/flash_teams/:id/:event_id/hire_form/send_task_rejection' => 'flash_teams#send_task_rejection'
  post '/flash_teams/:id/:event_id/hire_form/send_task_available' => 'flash_teams#send_task_available'
  
  get '/flash_teams/:id/:event_id/panels' => 'flash_teams#panels'
  
  get '/flash_teams/:id/:event_id/delay' => 'flash_teams#delay'
  get '/flash_teams/:id_team/:event_id/get_delay' => 'flash_teams#get_delay'

  resources :members do
    member do
      get :invite
      get :reInvite
      get :invited
      get :confirm_email
      post :register
    end
  end
  
  post '/activity_logs/create' => 'activity_logs#create'
  post '/activity_logs/log_update' => 'activity_logs#log_update'

  get '/users/logout' => 'users#logout'
  get '/users/login' => 'users#login'
  
  post '/users/post_login' => 'users#post_login'
  post '/users/post_login' => 'users#post_login'
  
  resources :users do
    member do
      post :create
    end
  end
  
  #resources :workers
  get '/workers/index' => 'workers#index' 
  get '/workers/register' => 'workers#register' 
  get '/workers/confirmation' => 'workers#confirmation'
  get '/workers/apply' => 'workers#apply' 
  get '/workers/apply/:panel' => 'workers#apply'
  get '/workers/:id/destroy' => 'workers#destroy' 
  get '/workers/filter_workers' => 'workers#filter_workers'
  get '/workers/filter_workers_emails' => 'workers#filter_workers_emails'
  get '/workers/right_sidebar_filt' => 'workers#right_sidebar_filt'
  get '/workers/filter_workers_rightsidebar' => 'workers#filter_workers_rightsidebar'

  
  resources :workers do
    member do
      post :create
    end
  end
  
  
  
  

end
