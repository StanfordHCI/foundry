class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def authenticate!
    @user = User.where(id: session[:user_id]).first
    @title = "Invalid User ID"
    # redirect_to(:controller => :users, :action => :login) unless @user
    redirect_to(welcome_index_path) unless @user
  end
  
  def valid_user?(options = {})
  
  	# methods could do something like "if valid_user?(save_loc: false)" if they don't want to save the location
  	  save_loc = options[:save_loc]
	  
	  if save_loc != false	  
	  	session.delete(:return_to)
	  	session[:return_to] ||= request.original_url
	  end
	  
	  redirect_to(:controller => :users, :action => :login) and return unless session[:member]
		  
	  if session[:member][:mem_type].nil? || session[:member][:mem_type] == "worker"
		  	valid_user = false	
	  elsif session[:member][:mem_type] == "author" || "pc" || "client"
			valid_user = true		
	  else 
			valid_user = false
	  end
 		valid_user	
   end
end
