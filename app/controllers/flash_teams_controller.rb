require 'json'
#require 'google/api_client'
#require 'google/api_client/auth/file_storage'
#require 'google/api_client/auth/installed_app'
require 'securerandom'

class FlashTeamsController < ApplicationController
  helper_method :get_tasks

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
	    copy.status = original.status
	    copy.save
	
	    # Redirect to the list of things
	    redirect_to :action => 'index'   
    end #end if session not nil
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
  
  if !params.has_key?("uniq") #if in author view
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
    	end
    end


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
    flash_team = FlashTeam.find(params[:pk])
    flash_team.name = params[:value]
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
   		@flash_team = FlashTeam.find(params[:id])
   		
   		# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    @flash_team_events = flash_team_status['flash_teams_json']['events']
   
   end
   
   def hire_form
	   	@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@flash_team = FlashTeam.find(params[:id])
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    #@flash_team_event = flash_team_status['flash_teams_json']['events'][@id_task]
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
	    #right now, this only takes the first member assigned to a task (need to figure out what to do when a task has more than 1 member)
	    member_id = @flash_team_event['members'][0]
	    
	    member_obj = getMemberById(@id_team, @id_task, member_id) 
	    
	    #@task_members = flash_team_status['flash_teams_json']['members'][member_index]['role']
	    if member_obj != -1
	    	@task_members = member_obj['role']
	    else
	    	@task_members = nil
	    end  
	    
	    #@my_text = "Here is some basic text...\n...with a line break."
	    @task_avail_email_subject = "From Stanford HCI Group: " + @flash_team_event["title"] + " Task Is Available"
	    
@task_avail_email_content = "Hi, 

This is an email from the Stanford HCI Group notifying you that a job requiring a " + @task_members + " for the " + @flash_team_event['title'] + " task for the " + @flash_team_json['title'] + " project has become available. Please take a look at the following job description to see if you are interested in and qualified to complete this task within the specified deadline. 

Project description: " + @flash_team_json['projectoverview'].to_s + 

"Task description: " + @flash_team_event['description'].to_s + 

"As stated in our previous email, we will be asking you to use our platform, Foundry, to keep track of your progress and submit your work.  If you have not already done so, please familiarize yourself with Foundry by visiting http://bit.ly/foundryexample and clicking the \"Start Foundry Tour\" button on the top left of the page.  Feel free to contact us if you have any questions regarding the use of Foundry. 

Input description: As the "+ @task_members + ", you will receive the following input(s): " + @flash_team_event['inputs'].to_s + ". Below is the link to the input of your task [INSERT LINK HERE] 

Output requirements: You are asked to produce the following output(s): " + @flash_team_event['inputs'].to_s + ". When you are done, you'll need to upload the deliverables (specified below) to the " + @flash_team_event['title'].to_s + " task folder on Foundry and press complete on your task. 

The deliverables are the [INSERT DELIVERABLE DESCRIPTION/FORMAT]. 

Deadline: You will have " + @flash_team_event['duration'].to_s + " minutes to finish this task. Since " + @flash_team_event['duration'].to_s + " minutes is a relatively short amount of time, we expect more of a working prototype rather than a finished product. 

If you are hired, you must start working on the task within 30 minutes. You should confirm that you have started working on the task by accepting the contract on oDesk and signing in to Foundry via the link that will be sent to you. 

If you are ready to start working on this task, reply to this email with your name in the content of the email as well as a confirmation that you can start within 30 minutes from when you are hired. If you are hired, you will be assigned to the " + @flash_team_event['title'].to_s + " task.  We will hire you as soon as possible if the task is still available. If not, you will be notified for future opportunities. 

Best, \nStanford HCI Research Team"

   end
   
   def send_task_available
   
   		@sender_email = params[:sender_email]
   		@recipient_email = params[:recipient_email]
   		@subject = params[:subject]
   		@message = params[:message]
   		
   		UserMailer.send_task_hiring_email(@sender_email, @recipient_email, @subject, @message).deliver
   
   end
   
   def task_rejection
   
   		@id_team = params[:id]
	   	@id_task = params[:event_id].to_i
	   	
	   	@flash_team = FlashTeam.find(params[:id])
	   	    
	   	# Extract data from the JSON
	    flash_team_status = JSON.parse(@flash_team.status)
	    @flash_team_json = flash_team_status['flash_teams_json']
	    @flash_team_event = @flash_team_json['events'][@id_task]
	    
	   @task_rej_email_subject = "From Stanford HCI Group: " + @flash_team_event["title"] + " Task Is No Longer Available"
	   @task_rej_email_content = "Thank you for applying to work on the " + @flash_team_event['title']+ " task for the " + @flash_team_json['title'] +" project. Unfortunately, the job is no longer available. As you know, we use an on-demand hiring process that assigns the job to the first person who claims it. However, we have more upcoming projects and we will keep you posted as other job opportunities become available. \n\nIf you don't want to be informed about our future job opportunities, please reply to this email with your name in the content. \n\nThank you, \nStanford HCI Research Team" 
	   	    
   end
   
   def send_task_rejection
   
   		@sender_email = params[:sender_email]
   		@recipient_email = params[:recipient_email]
   		@subject = params[:subject]
   		@message = params[:message]
   		
   		UserMailer.send_task_hiring_email(@sender_email, @recipient_email, @subject, @message).deliver
   
   end

  def flash_team_params params
    params.permit(:name, :author)
  end
end