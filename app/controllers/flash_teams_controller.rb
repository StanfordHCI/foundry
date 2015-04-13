require 'json'
#require 'google/api_client'
#require 'google/api_client/auth/file_storage'
#require 'google/api_client/auth/installed_app'
require 'securerandom'

class FlashTeamsController < ApplicationController
  helper_method :get_tasks
  before_filter :valid_user?, only: [:panels, :hire_form, :send_task_available, :task_acceptance, :send_task_acceptance, :task_rejection, :send_task_rejection]

	def new
	# check to see if the user id exists in the database 
		#if User.where(:id => params[:user_id]).blank? #user id does not exist 
		if !session[:user].nil?
			#@user = User.find(params[:id])
			@user = session[:user]
			@flash_team = FlashTeam.new
		else
			@user = nil 
			@title = "Invalid User ID"
			flash[:notice] = "You must be logged in to create a team."
			redirect_to(:controller => :users, :action => :new)
			return 
		end
			
	end

  def create 
  	if !session[:user].nil?
    name = flash_team_params(params[:flash_team])[:name]

    author = flash_team_params(params[:flash_team])[:author]
    
    @user = session[:user]
    
    @flash_team = FlashTeam.create(:name => name, :author => author, :user_id => @user.id)

    # get id
    id = @flash_team[:id]

    # store in flash team
    @flash_team.json = '{"title": "' + name + '","id": ' + id.to_s + ',"events": [],"members": [],"interactions": [], "author": "' + author + '"}'

    if @flash_team.save
      #redirect_to @flash_team
      redirect_to edit_flash_team_path(id)
    else
      render 'new'
    end
    end #end if session user not nil 
  end

  def show
  	if session[:user].nil?
		@user = nil 
		@title = "Invalid User ID"
		@flash_team = nil
		redirect_to(welcome_index_path)				
  	else
    	@flash_team = FlashTeam.find(params[:id])
    
		if @flash_team.user_id != session[:user].id
			flash[:notice] = 'You cannot access this flash team.' 
    		redirect_to(flash_teams_path)
		end
	end
  end


  def duplicate
  	if !session[:user].nil?
	  	@user = session[:user]
	  	
	    # Locate data from the original
	    original = FlashTeam.find(params[:id])
	
	    # Then create a copy from the original data
	    copy = FlashTeam.create(:name => original.name + " Copy", :author => original.author, :user_id => @user.id)
	    copy.json = '{"title": "' + copy.name + '","id": ' + copy.id.to_s + ',"events": [],"members": [],"interactions": [], "author": "' + copy.author + '"}'
	    #copy.status = original.original_status
	    copy.status = createDupTeamStatus(copy.id, original.original_status)
	    
	    # new_status = createDupTeamStatus(copy.id, original.original_status)
# 	    new_status_json = new_status.to_s
# 	    copy.status = new_status_json
	    copy.save
	    
	    
	    # to do: 1) update member uniq/invite link; 2) update google drive folder info; 3) update latest time (maybe)
	
	    # Redirect to the list of things
	    redirect_to :action => 'index'   
    end #end if session not nil
  end

  
  def createDupTeamStatus(dup_id, orig_status)
	original_status = JSON.parse(orig_status)
	
	# update the member invite links  
	flash_team_members = original_status['flash_teams_json']['members']
        
    flash_team_members.each do |member|
    	uniq = SecureRandom.uuid
    	url = url_for :controller => 'members', :action => 'invited', :id => dup_id, :uniq => uniq
    	
    	member['uniq'] = uniq
		member['invitation_link'] = url 		
    end
    
    # update the google drive folder
    original_status['flash_teams_json'].except!("folder")

	return original_status.to_json

  end
  
  def index
  		# check to see if the user id exists in the database 
		if session[:user].nil?
			@user = nil 
			@title = "Invalid User ID"
			@flash_teams = nil
			redirect_to(welcome_index_path)
		else
			@user = User.find(session[:user].id)
			
			@flash_teams = FlashTeam.where(:user_id => @user.id).order(:id).reverse_order	
		end
  end


rescue_from ActiveRecord::RecordNotFound do
  #flash[:notice] = 'The object you tried to access does not exist'
  render 'member_doesnt_exist'   # or e.g. redirect_to :action => :index
end
 
  def edit
  
  	session.delete(:return_to)
	session[:return_to] ||= request.original_url
	  
  if !params.has_key?("uniq") #if in author view
	  	if session[:user].nil? 
			@user = nil 
			@title = "Invalid User ID"
			@flash_team = nil
			redirect_to(welcome_index_path) and return		
		else 
			@flash_team = FlashTeam.find(params[:id])
			
			if @flash_team.user_id != session[:user].id 
				flash[:notice] = 'You cannot access this flash team.' 
				redirect_to(flash_teams_path) and return 
			end
		end
			
  	else #else it is in worker view 
    	@flash_team = FlashTeam.find(params[:id])
    end 
    
	#note: member info is stored in status json in flash_teams_json
		
    #customize user views
    status = @flash_team.status 
    if status == nil
      @author_runtime=false
    else
      json_status= JSON.parse(status)
      if json_status["flash_team_in_progress"] == nil
        @author_runtime=false
      else
        @author_runtime=json_status["flash_team_in_progress"]
      end
    end

    if params.has_key?("uniq")
     @in_expert_view = true
     @in_author_view = false

     uniq = params[:uniq]
    
     Member.find_by! uniq: uniq
     #if !(Member.exist(:uniq => uniq))  #role has been reinvited and doesn't exist anymore
     #   render 'member_doesnt_exist'
     #end 

     member = Member.where(:uniq => uniq)[0]
     @user_name = member.name
     
          
     
    flash_team_members = json_status['flash_teams_json']['members']
        
    flash_team_members.each do |member|
    	if(member['uniq'] == uniq)
    		@member_type = member['type']
    		@member_role = member['role']
    	end
    end
    
    #create session to use for hiring panel
     #session[:member] = member.uniq
     session.delete(:member)
	 session[:member] ||= {:mem_uniq => member['uniq'], :mem_type => @member_type}



    else
     @in_expert_view = false
     @in_author_view = true
    end
    #end

    flash_teams = FlashTeam.all
    @events_array = []
    flash_teams.each do |flash_team|
      next if flash_team.json.blank?
      flash_team_json = JSON.parse(flash_team.json)
      flash_team_events = flash_team_json["events"]
      flash_team_events.each do |flash_team_event|
        @events_array << flash_team_event
      end
    end
    @events_json = @events_array.to_json
  end

  def rename
    # update flash team name in rails model
    flash_team = FlashTeam.find(params[:pk])
    flash_team.name = params[:value]
    
    # update flash teams title in json object saved in rails model
    flash_team_json = JSON.parse(flash_team.json)
    flash_team_json["title"] = params[:value] 
    flash_team.json = flash_team_json.to_json

    # update flash teams title in flash team json object saved in status json object saved in rails model
    if !flash_team.status.nil?
      json_status = JSON.parse(flash_team.status)
      json_status["flash_teams_json"]["title"] = params[:value] 
      flash_team.status = json_status.to_json
    end

    flash_team.save
    head :ok
  end

  def update
    @flash_team = FlashTeam.find(params[:id])

    if @flash_team.update(flash_team_params(params))
      redirect_to @flash_team
    else
      render 'edit'
    end
  end
  
  def destroy
    @flash_team = FlashTeam.find(params[:id])
    @flash_team.destroy

    redirect_to flash_teams_path
  end

  def ajax_update
    @flash_team = FlashTeam.find(params[:id])
    @flash_team.json = 0
    @flash_team.save
  end

  def get_status
    @flash_team = FlashTeam.find(params[:id])
    respond_to do |format|
      format.json {render json: @flash_team.status, status: :ok}
    end
  end

  def update_status
    status = params[:localStatusJSON]
    @flash_team = FlashTeam.find(params[:id])
    @flash_team.status = status

    # if the author name == defaultAuthor, update it with the author name (should only need to update the first time)   
    # json_status = JSON.parse(@flash_team.status)
    
    # if (json_status["flash_teams_json"]["author"].to_s == "defaultAuthor")
    #   json_status["flash_teams_json"]["author"] = @flash_team.author
    #   @flash_team.status = json_status.to_json
    # end

    @flash_team.save

    respond_to do |format|
      format.json {render json: "saved".to_json, status: :ok}
    end
  end
  
  def update_original_status
    status = params[:localStatusJSON]
    @flash_team = FlashTeam.find(params[:id])
    @flash_team.original_status = status
    @flash_team.save

    respond_to do |format|
      format.json {render json: "saved".to_json, status: :ok}
    end
  end

  def update_json
    json = params[:flashTeamJSON]
    @flash_team = FlashTeam.find(params[:id])
    @flash_team.json = json
    @flash_team.save

    respond_to do |format|
      format.json {render json: "saved".to_json, status: :ok}
    end
  end

  def get_json
    @flash_team = FlashTeam.find(params[:id])
    status_hashmap = JSON.parse(@flash_team.status)
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + status_hashmap["flash_teams_json"].to_json
    respond_to do |format|
      format.json {render json: status_hashmap["flash_teams_json"].to_json, status: :ok}
    end
  end

  def early_completion_email
    uniq = params[:uniq]
    minutes = params[:minutes]

    email = Member.where(:uniq => uniq)[0].email
    if email
      UserMailer.send_early_completion_email(email,minutes).deliver
    end

    respond_to do |format|
      format.json {render json: nil, status: :ok}
    end
  end

  def before_task_starts_email
    email = params[:email]
    minutes = params[:minutes];
    # IMPORTANT
    UserMailer.send_before_task_starts_email(email,minutes).deliver
    
    #NOTE: Rename ‘send_confirmation_email’ above to your method name. It may/may not have arguments, depends on how you defined your method. The ‘deliver’ at the end is what actually sends the email.
    respond_to do |format|
      format.json {render json: nil, status: :ok}
    end
  end
 
  def delayed_task_finished_email
    uniq = params[:uniq]
    minutes = params[:minutes]
    title = params[:title]
    
    email = Member.where(:uniq => uniq)[0].email
    UserMailer.send_delayed_task_finished_email(email,minutes,title).deliver
    
    respond_to do |format|
      format.json {render json: nil, status: :ok}
    end
  end
  
  #renders the delay form that the DRI has to fill out
  def delay
    @id_team = params[:id]

    @action_link="/flash_teams/"+params[:id]+"/"+params[:event_id]+"/get_delay"
  end  


  def get_delay
    event_id=params[:event_id]
    event_id=event_id.to_f-1

    #dri_estimation = params[:q] 
    flash_team = FlashTeam.find(params[:id_team])
    #flash_team_status = JSON.parse(flash_team.status)
    #delayed_tasks_time=flash_team_status["delayed_tasks_time"]
    #delay_start_time = delayed_tasks_time[event_id]
    #delay_start_time = delay_start_time / 60

    #@delay_estimation = dri_estimation + delay_start_time
    @delay_estimation = params[:q]

      if flash_team.notification_email_status != nil
        notification_email_status = JSON.parse(flash_team.notification_email_status)
      else
        notification_email_status = []
      end
      notification_email_status[event_id.to_f+1] = true;
      flash_team.notification_email_status = JSON.dump(notification_email_status)
      flash_team.save

      if !flash_team.status.blank?
        flash_team_status = JSON.parse(flash_team.status)
        flash_team_json=flash_team_status["flash_teams_json"]
        flash_team_members=flash_team_json["members"]
        flash_team_events=flash_team_json["events"]
      
        #dri_role=flash_team_events[event_id.to_f]["members"][0]
        dri =  flash_team_events[event_id.to_f]["dri"]
        dri_member= flash_team_members.detect{|m| m["id"] == dri.to_i}
        if dri_member  == nil
          puts "dri is not defined"
          dri_member= flash_team_members.detect{|m| m["id"].to_i == flash_team_events[event_id.to_f]["members"][0].to_i}
        end
        dri_role=dri_member["role"]
        event_name= flash_team_events[event_id.to_f]["title"]
        flash_team_members.each do |member|
            #tmp_member= flash_team_members.detect{|m| m["role"] == member["role"]}
            #member_id= tmp_member["id"]
            uniq = member["uniq"]
            
            next if Member.where(:uniq => uniq)[0] == nil

            email = Member.where(:uniq => uniq)[0].email
            UserMailer.send_task_delayed_email(email,@delay_estimation,event_name,dri_role).deliver
         
        end
      end
  end

  def get_user_name
     
     uniq=""
     if params[:uniq] != ""
       uniq = params[:uniq]
      member = Member.where(:uniq => uniq)[0]
    
      user_name = member.name
      user_role="" 
     else
        #it is the requester
        flash_team = FlashTeam.find(params[:id])
        flash_team_json = JSON.parse(flash_team.json)
        user_name = flash_team_json["author"]
        user_role="Author"
     end

     respond_to do |format|
      format.json {render json: {:user_name => user_name, :user_role => user_role, :uniq => uniq}.to_json, status: :ok}
    end
  end
  

  def event_search

    # Get the parameter that corresponds to the search query
    query = params[:params].downcase

    # Get all the flash teams
    flash_teams = FlashTeam.all

    # Create an array for storing event matches
    @events = Array.new
    @eventHashes = Array.new

    # Iterate through them to pick up on events
    flash_teams.each do |flash_team|

      # If the team is not blank, then attempt to parse events out
      if !flash_team.status.blank?

        # Extract data from the JSON
        flash_team_status = JSON.parse(flash_team.status)
        flash_team_events = flash_team_status['flash_teams_json']['events']
        
        # Loop through all the events
        flash_team_events.each do |flash_team_event|

          # Case insensitive search match
          if flash_team_event['title'].downcase.include? query
            @events << flash_team_event
            @eventHashes << Digest::MD5.hexdigest(flash_team_event.to_s)
          end

        end
      end
    end

    render :partial => "event_search_results"

   end
   
   def task_portal
   
   		@id_team = params[:id]
   		
   		#@flash_team = FlashTeam.find(params[:id])
   		
   		if valid_user?	
			@flash_team = FlashTeam.find(params[:id])
		end
   		
   		# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    @flash_team_events = flash_team_status['flash_teams_json']['events']
   
   end
   
   
     def hire_form
	   	   	
	   	@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@task_avail_active = "active"

		@flash_team = FlashTeam.find(params[:id])
   		   	
   		@workers = Worker.all.order(name: :asc)
	
   		@panels = Worker.distinct.pluck(:panel)
	
   		@fw = Worker.all.pluck(:email)   
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    #@flash_team_event = flash_team_status['flash_teams_json']['events'][@id_task]
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
	    minutes = @flash_team_event['duration']
		hh, mm = minutes.divmod(60)
		@task_duration = hh.to_s 
		
		if hh==1
			@task_duration += " hour"
		else
			@task_duration += " hours"
		end
		
		if mm>0
			@task_duration += " and " + mm.to_s + " minutes"
		end
	    
	    #array for all members associated with this event
	    @task_members = Array.new
	    
	    # Add all the members associated with event to @task_members array
	    @flash_team_event['members'].each do |task_member|
	    	@task_members << getMemberById(@id_team, @id_task, task_member)
	    end
	    
	    @task_avail_email_subject = "From Stanford HCI Group: " + @flash_team_event["title"] + " Task Is Available"
   		@url1 = url_for :controller => 'flash_teams', :action => 'listQueueForm', :id => @id_team, :event_id => @id_task.to_s
   
	     end
  
  def send_task_available

 		@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@task_avail_active = "active";
	   	
	   	@flash_team = FlashTeam.find(params[:id])
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
   		if !params[:sender_email].empty?
   			@sender_email = params[:sender_email]
  		else
  			@sender_email = ENV['DEFAULT_EMAIL']
  		end
   		
   		@flash_team_name = @flash_team_json['title']
   		
   		@task_member = params[:task_member] #i.e. role of recipient 
   		@recipient_email = params[:recipient_email]
   		@subject = params[:subject]
   		
   		@task_name = params[:task_name]
   		@project_overview = params[:project_overview]
   		@task_description = params[:task_description]
   		
   		
   		@all_inputs = params[:all_inputs]
   		@input_link = params[:input_link]
   		
   		@outputs = params[:outputs]
   		@output_description = params[:output_description]
   		
   		@task_duration = params[:task_duration]
   		
   		#@message = params[:message]

   		@task_members = Array.new
   		@flash_team_event['members'].each do |task_member|
   			@task_members << getMemberById(@id_team, @id_task, task_member)
   		end
   		@uniq = ""
   		@task_members.each do |task_member|
   			if task_member['role'] == @task_member
   				@uniq = task_member['uniq']
    				break
   			end
   		end

   		#@message = "<p>This is an email from the Stanford HCI Group notifying you that a job requiring a #{@task_member} for the #{@task_name} task for the #{@flash_team_json['title']} project has become available. Please take a look at the following job description to see if you are interested in and qualified to complete this task within the specified deadline.</p>"
   		emails = @recipient_email.split(',')
   		@url1 = url_for :controller => 'flash_teams', :action => 'listQueueForm', :id => @id_team, :event_id => @id_task.to_s
   		for email in emails
   			newLanding = Landing.new
   			newLanding.id_team = @id_team
   			newLanding.id_event = @id_task
   			newLanding.email = email.strip
   			newLanding.task_member = @task_member
   			newLanding.status = 's'
   			newLanding.uniq = @uniq
   			newLanding.save
   			@url = url_for :controller => 'landings', :action => 'view', :id => @id_team, :event_id => @id_task.to_s, :task_member => @task_member, :email => email.strip
   			UserMailer.send_task_hiring_email(@sender_email, email, @subject, @flash_team_name, @task_member, @task_name, @project_overview, @task_description, @all_inputs, @input_link, @outputs, @output_description, @task_duration, @url).deliver
   		end
   
   end
   
      
      def task_acceptance
	   	@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@task_accept_active = "active"
	   		   	
		@flash_team = FlashTeam.find(params[:id])
		
		@workers = Worker.all.order(name: :asc)
		@panels = Worker.distinct.pluck(:panel)
		@fw = Worker.all.pluck(:email)  
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    #@flash_team_event = flash_team_status['flash_teams_json']['events'][@id_task]
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
	    minutes = @flash_team_event['duration']
		hh, mm = minutes.divmod(60)
		@task_duration = hh.to_s 
		
		if hh==1
			@task_duration += " hour"
		else
			@task_duration += " hours"
		end
		
		if mm>0
			@task_duration += " and " + mm.to_s + " minutes"
		end
 
	    #array for all members associated with this event
	    @task_members = Array.new
	    
	    # Add all the members associated with event to @task_members array
	    @flash_team_event['members'].each do |task_member|
	    	@task_members << getMemberById(@id_team, @id_task, task_member)
	    end
	    	    
	    #@my_text = "Here is some basic text...\n...with a line break."
	    @task_acceptance_email_subject = "From Stanford HCI Group: " + @flash_team_event["title"] + " Task Acceptance"
	    
  end
   
   def send_task_acceptance
   
   		@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@task_accept_active = "active"
	   	
	   	@flash_team = FlashTeam.find(params[:id])
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
   		if !params[:sender_email].empty?
   			@sender_email = params[:sender_email]
  		else
  			@sender_email = "stanfordhci.odesk@gmail.com"
  		end
   		
   		@flash_team_name = @flash_team_json['title']
   		
   		tm = params[:task_member].split(',') #i.e. role of recipient 
   		@task_member = tm[0][2..-2]
   		@recipient_email = params[:recipient_email]
   		@subject = params[:subject]
   		
   		@task_name = params[:task_name]
   		@project_overview = params[:project_overview]
   		@task_description = params[:task_description]
   		
   		
   		@all_inputs = params[:all_inputs]
   		@input_link = params[:input_link]
   		
   		@outputs = params[:outputs]
   		@output_description = params[:output_description]
   		
   		@foundry_url = params[:foundry_url]

   		
   		UserMailer.send_task_acceptance_email(@sender_email, @recipient_email, @subject, @flash_team_name, @task_member, @task_name, @project_overview, @task_description, @all_inputs, @input_link, @outputs, @output_description, @task_duration, @foundry_url).deliver
   
   end
   
   def task_rejection
   		
   		@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@task_reject_active = "active"
	   		   	
		@flash_team = FlashTeam.find(params[:id])
		
		@workers = Worker.all.order(name: :asc)
		@panels = Worker.distinct.pluck(:panel)
		@fw = Worker.all.pluck(:email)  
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
	     #array for all members associated with this event
	    @task_members = Array.new
	    
	    # Add all the members associated with event to @task_members array
	    @flash_team_event['members'].each do |task_member|
	    	@task_members << getMemberById(@id_team, @id_task, task_member)
	    end
	    
	    @foundry_url = params[:foundry_url]
	    
	   @task_rej_email_subject = "From Stanford HCI Group: " + @flash_team_event["title"] + " Task Is No Longer Available"
	   	   	    
   end
   
   def send_task_rejection
   
  		@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@task_reject_active = "active"
	   	
	   	@flash_team = FlashTeam.find(params[:id])
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
   		if !params[:sender_email].empty?
   			@sender_email = params[:sender_email]
  		else
  			@sender_email = "stanfordhci.odesk@gmail.com"
  		end
   
   		@recipient_email = params[:recipient_email]
   		@subject = params[:subject]
   		
   		@flash_team_name = @flash_team_json['title']
   		
   		@task_name = params[:task_name]
   		
   		@task_member = params[:task_member]
   		
   		UserMailer.send_task_rejection_email(@sender_email, @recipient_email, @subject, @flash_team_name, @task_name, @task_member).deliver   
   end
   
   def panels
   
   	#@show_right_sidebar = false
   	@panels_active = "active"
   	
   	session.delete(:return_to)
   	session[:return_to] ||= request.original_url
  	
   	session.delete(:ref_page)
   	session[:ref_page] ||= {:controller => params[:controller], :action => params[:action]}

   	@id_team = params[:id]
   	@id_task = params[:event_id].to_i
   	
	@flash_team = FlashTeam.find(params[:id])
   	    
   	# Extract data from the JSON
    flash_team_status = JSON.parse(@flash_team.status)
    @flash_team_json = flash_team_status['flash_teams_json']
    @flash_team_event = @flash_team_json['events'][@id_task]
	    
   	@workers = Worker.all.order(name: :asc)
    	
  	@panels = Worker.distinct.pluck(:panel)
  	
  	@fw = Worker.all.pluck(:email)   
   end
   
  def flash_team_params params
    params.permit(:name, :author)
  end

  def listQueueForm
    @list_queue_active = "active"
    @id_team = params[:id]
    @id_task = params[:event_id].to_i
    @flash_team = FlashTeam.find(params[:id])
   		@workers = Worker.all.order(name: :asc)
   		@panels = Worker.distinct.pluck(:panel)
	
   		@fw = Worker.all.pluck(:email)   
    # Extract data from the JSON
    flash_team_status = JSON.parse(@flash_team.status)
    @flash_team_json = flash_team_status['flash_teams_json']
    @flash_team_event = @flash_team_json['events'][@id_task]
    @flash_team_name = @flash_team_json['title']
    @task_name = @flash_team_event['title']
    @project_overview = @flash_team_json['projectoverview']
    @task_description = @flash_team_event['notes']
    @inputs = @flash_team_event['inputs']
    #@input_link = params[:input_link]
    @outputs = @flash_team_event['outputs']
    #@output_description = params[:output_description]
    minutes = @flash_team_event['duration']
    hh, mm = minutes.divmod(60)
    @task_duration = hh.to_s 
    if hh==1
      @task_duration += " hour"
    else
      @task_duration += " hours"
    end
    if mm>0
      @task_duration += " and " + mm.to_s + " minutes"
    end
#array for all members associated with this event
	    @task_members = Array.new
	    # Add all the members associated with event to @task_members array
	    @flash_team_event['members'].each do |task_member|
	    	@task_members << getMemberById(@id_team, @id_task, task_member)
	    end
  end

  def listQueue
    @list_queue_active = "active"
    @id_team = params[:id]
    @id_task = params[:event_id].to_i
    @flash_team = FlashTeam.find(params[:id])
    @url1 = url_for :controller => 'flash_teams', :action => 'listQueueForm', :id => @id_team, :event_id => @id_task.to_s
    # Extract data from the JSON
    flash_team_status = JSON.parse(@flash_team.status)
    @flash_team_json = flash_team_status['flash_teams_json']
    @flash_team_event = @flash_team_json['events'][@id_task]
    @flash_team_name = @flash_team_json['title']
    #tm = params[:task_member].split(',') role of recipient
@task_member = params[:task_member]
    @task_name = @flash_team_event['title']
    @project_overview = @flash_team_json['projectoverview']
    @task_description = @flash_team_event['notes']
    @inputs = @flash_team_event['inputs']
    #@input_link = params[:input_link]
    @outputs = @flash_team_event['outputs']
    #@output_description = params[:output_description]
    minutes = @flash_team_event['duration']
    hh, mm = minutes.divmod(60)
    @task_duration = hh.to_s 
    if hh==1
      @task_duration += " hour"
    else
      @task_duration += " hours"
    end
    if mm>0
      @task_duration += " and " + mm.to_s + " minutes"
    end
    @queue = Array.new
    @queue = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'p').order('created_at')
    @addresses   = Array.new
    for t in @queue
      @addresses << t.email
    end
    @addresses = @addresses.uniq
   		@task_members = Array.new
   		@flash_team_event['members'].each do |task_member|
   			@task_members << getMemberById(@id_team, @id_task, task_member)
   		end
   		@uniq = ""
   		@task_members.each do |task_member|
   			if task_member['role'] == @task_member
   				@uniq = task_member['uniq']
    				break
   			end
   		end

    if @addresses.length > 0
      @member = Array.new
      @member = Member.where(:uniq => @uniq, :email => @addresses[0], :email_confirmed => true)
    end
  end
end