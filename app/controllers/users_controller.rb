class UsersController < ApplicationController

# creating an account 	
	def new 
	
		if !session[:user_id].nil?  # redirect user to their team library if he or she visits the registration screen but is already logged in
			redirect_to(:controller => :flash_teams, :action => :index)
		end		
	
		@user = User.new 
		@title = "Create an account"	
	
	end #end new 
	
	def create 
		username = registration_params(params[:user])[:username].downcase
		password = registration_params(params[:user])[:password]
		password_confirmation = registration_params(params[:user])[:password_confirmation]
		
		@user = User.new(:username => username, :password => password, :password_confirmation => password_confirmation)
		@user.save()
		
		if @user.save
			session[:user_id] = @user.id
			flash[:notice] = "Account created! Welcome, #{@user.username}!"
			
			session.delete(:member)
			session[:member] ||= {:mem_uniq => "author", :mem_type => "author"}

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
		if !session[:user_id].nil?
			redirect_to(:controller => :flash_teams, :action => :index)
		end	
		@title = "Login"
	end

	def post_login
		@user = User.find_by_username(params[:login].downcase)	
		if @user && @user.authenticate(params[:password])
			log_in(@user)
			
			session.delete(:member)
			session[:member] ||= {:mem_uniq => "author", :mem_type => "author"}

			flash[:notice] = "Welcome back, #{@user.username}!"

			if !session[:return_to].nil?
				redirect_to(session[:return_to])
			else
				redirect_to(:controller => :flash_teams, :action => :index)
			end			
		else #login does not exist in the database
			flash[:notice] = "Incorrect username or password"
			redirect_to(:action => :login)
		end
	end
	
	
	def logout
		reset_session #destroy session
		#session[:user] = nil
		session.delete(:user_id)
		flash[:notice] = "Succesfully logged out."
		#redirect_to(:action => :new) # redirect user to the login screen 
		redirect_to(welcome_index_path)
		#redirect_to(:controller => :flash_teams, :action => :index)
	end #end logout
	

private
def registration_params(params)
  return params.permit(:username, :password, :password_confirmation)
end



end
