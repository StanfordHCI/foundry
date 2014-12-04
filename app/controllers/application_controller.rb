class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def valid_user?
	  if session[:user].nil? 	  	
		  	if !session[:member].nil? && session[:member][:mem_type] == "pc" || "client"
			  	valid_user = true
			else
				valid_user = false
			end			
	   else 
			valid_user = true	
	   end
	
		valid_user	
   end
end
