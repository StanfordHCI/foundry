class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def valid_user?
	  
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
