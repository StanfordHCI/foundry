class WorkersController < ApplicationController
 
  def index
  	session.delete(:return_to)
  	session[:return_to] ||= request.original_url
  	session.delete(:ref_page)
  	session[:ref_page] ||= {:controller => params[:controller], :action => params[:action]}

    @workers = Worker.all.order(name: :asc)
    	
  	@panels = Worker.distinct.pluck(:panel)
  	
  	@fw = Worker.all.pluck(:email)
  	  	  	  	  	
  end
  
    def filter_workers
    
  	if params[:panels] && params[:panels] != ""
  		@workers = Worker.where(:panel => params[:panels]).order(name: :asc)
  		@fw = Worker.where(:panel => params[:panels]).pluck(:email)
	else
    	@workers = Worker.all.order(name: :asc)
		@fw = Worker.all.pluck(:email)
	end
    	
  	@panels = Worker.distinct.pluck(:panel)
  	  	  
  	@abc = Worker.where(:id => params[:workers]).pluck(:email)
  	
  	render :partial => "filter_workers"
  	
  end
  
  def filter_workers_emails
  	@abc = Worker.where(:id => params[:workers]).pluck(:email)
  	
  	render :partial => "filter_workers_emails"
  	
  end

  def new
  	@worker = Worker.new
  end

  def create
  	@worker = Worker.new(worker_params)
    if @worker.save
        redirect_to :action => 'show', :id => @worker.id
        #redirect_to session.delete(:return_to), :id => @worker.id, alert: "Success!"
    else
        redirect_to new_worker_path, alert: "Error creating worker."
    end
  end

  def show
  	@worker = Worker.find(params[:id])
  	
  	if session[:ref_page][:controller] == "workers" && session[:ref_page][:action] == "register"
  		#redirect_to :action => 'confirmation', :id => @worker.id
  		redirect_to :action => 'confirmation'
  	end
  	
  	if session[:ref_page][:controller] == "flash_teams" && session[:ref_page][:action] == "panels"
  		redirect_to session.delete(:return_to)
  	end
  	
  	if session[:ref_page][:controller] == "workers" && session[:ref_page][:action] == "index"
  		redirect_to session.delete(:return_to)
  	end

  end
  
  def register
  	session.delete(:return_to)
  	session.delete(:ref_page)
  	session[:ref_page] ||= {:controller => params[:controller], :action => params[:action]}
  	
  	@worker = Worker.new
  end
  
  def edit
  	@worker = Worker.find(params[:id])
  end
  
  def update
  	worker = Worker.find(params[:id])
  	
  	worker.update(worker_params)
    
    if worker.save
        #redirect_to :action => 'show', :id => worker.id, alert: "Worker created successfully."
        redirect_to session.delete(:return_to)
    else
        #redirect_to :action => 'edit', :id => worker.id, alert: "Error updating worker." 
        redirect_to edit_worker_path(worker), alert: "Error updating worker."
    end
  end
  
   def destroy
  	worker = Worker.find(params[:id])
  	
  	worker.destroy
    
  	redirect_to session.delete(:return_to)

  end
  
  
  private

  def worker_params
    params.require(:worker).permit(:name, :email, :skype_username, :odesk_url, :timezone_utc, :additional_info, :panel)
  end

end
