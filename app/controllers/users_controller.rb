class UsersController < ApplicationController

# creating an account 	
	def new 
	
		if !session[:user].nil?  # redirect user to their team library if he or she visits the registration screen but is already logged in
			redirect_to(:controller => :flash_teams, :action => :index)
		end		
	
		@user = User.new 
		@title = "Create an account"	
	
	end #end new 
	
	def create 
		username = registration_params(params[:user])[:username]
		
		@user = User.new(:username => username)
		@user.save()
		
		if @user.save
			session[:user] = @user
			flash[:notice] = "Account created! Welcome, #{session[:user].username}!"

			redirect_to(:controller => :flash_teams, :action => :index)
		else
    		render(:action => :new)
		end	#end if user.save conditional 
	
	end #end def create 
	
	def index
	
	redirect_to(:action => :new)
	
	end
	
	# implements /users/login, which displays a simple login form where the user can enter their login name and password 
	def login 
	
		# redirect user to their team library if he or she visits the login screen but is already logged in
		if !session[:user].nil?
			redirect_to(:controller => :flash_teams, :action => :index)
		end		
		
		@title = "Login"
		
	end #end login 
	
	def post_login
		
		#username = login_params(params[:login])
		
		if User.exists?(:username => params[:login].downcase) # check to see if the login exists in the database 
			@user = User.find_by_username(params[:login].downcase)
			
				session[:user] = @user  #store user id in the session
				
				session.delete(:member)
				session[:member] ||= {:mem_uniq => "author", :mem_type => "author"}

				flash[:notice] = "Welcome back, #{session[:user].username}!"
				redirect_to(:controller => :flash_teams, :action => :index)
							
		else #login does not exist in the database
			flash[:notice] = "Invalid username."
			redirect_to(:action => :login)
		end
		
	end #end post_login
	
	
	def logout 
		reset_session #destroy session
		#session[:user] = nil
		session.delete(:user)
		flash[:notice] = "Succesfully logged out."
		#redirect_to(:action => :new) # redirect user to the login screen 
		redirect_to(welcome_index_path)
		#redirect_to(:controller => :flash_teams, :action => :index)
	end #end logout
	

private
def registration_params(params)
  return params.permit(:username)
end



end
