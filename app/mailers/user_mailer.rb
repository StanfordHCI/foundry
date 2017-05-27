class UserMailer < ActionMailer::Base
  #default from: "stanfordhci.odesk@gmail.com",
          #bcc: "stanfordhci.odesk@gmail.com"

  default from: ENV['DEFAULT_EMAIL'],
          bcc: ENV['DEFAULT_EMAIL']

          
 
  def send_early_completion_email(email,minutes)
  	  @minutes=minutes
  	  mail(:to => email, :subject => 'Your next upcoming task starts '+ minutes +' minutes early')  	   
  end
  
  def send_before_task_starts_email(email,minutes)
  	  @minutes=minutes
  	  mail(:to => email, :subject => 'Your task starts in '+minutes+' minutes')
  end

  def send_task_delayed_email(email,delay_estimation,event_name,dri_role)
    @event_name = event_name
    @dri_role = dri_role
    @delay_estimation = delay_estimation
  	mail(:to => email, :subject => 'The team is running '+delay_estimation+' behind schedule')
  end
  
  def send_delayed_dri_not_responded(email,event_name,dri_role)
    
    @event_name = event_name
    @dri_role = dri_role
    mail(:to => email, :subject => event_name +' is not finished on time')
  end

  def send_delayed_task_finished_email(email,minutes,title)
  	  @minutes=minutes
      @title = title
  	  mail(:to => email, :subject => title+' is finished')
  end

  def send_team_link_email(name, email_address, url)
    @url = url
    @name = name
    mail(:to => email_address, :subject => 'Link to your foundry team')
  end

  def send_confirmation_email(name, email_address, url)
  	@url = url
  	@name = name
    mail(:to => email_address, :subject => 'The Link To Your Account On Foundry')
  end

  #action is called in scheduler.rb
  def send_dri_on_delay_email(email,event_name, dri_role,url,team_id,event_id,cc_emails)
      @event_name=event_name
      @dri_role=dri_role
      @minutes="10"
      @url=url
      #@url="/flash_teams/"+team_id+"/"+event_id+"/delay"

      #@url2 =  url_for :controller => 'FlashTeamsController', :team_id => team_id ,:event_id => event_id , :action => 'delay'

      mail(:to => email, :cc => cc_emails, :subject => event_name +' run by ' + dri_role +' is running late')
       
  end
  
  
  def send_task_hiring_email(sender_email, recipient_email, subject, flash_team_name, task_member, task_name, project_overview, task_description, all_inputs, input_link, outputs, output_description, task_duration, url)
  
  	#@message = message.html_safe
  	@flash_team_name = flash_team_name
  	@task_member = task_member
  	@task_name = task_name
  	@project_overview = project_overview
  	@task_description = task_description
  	@all_inputs = all_inputs
  	@input_link = input_link
  	@outputs = outputs
  	@output_description = output_description
  	@task_duration = task_duration
  	@url = url
  		    	  
  	mail(:from => sender_email, :bcc => [recipient_email, ENV['DEFAULT_EMAIL']], :subject => subject)
  end

  def send_starter_task_email(sender_email, recipient_email, subject, flash_team_name, task_member, task_name, project_overview, task_description, all_inputs, input_link, outputs, output_description, task_duration, compensation_info, url)
  
    #@message = message.html_safe
    @flash_team_name = flash_team_name
    @task_member = task_member
    @task_name = task_name
    @project_overview = project_overview
    @task_description = task_description
    @all_inputs = all_inputs
    @input_link = input_link
    @outputs = outputs
    @output_description = output_description
    @task_duration = task_duration
    @compensation_info = compensation_info
    @url = url
              
    mail(:from => sender_email, :bcc => [recipient_email, ENV['DEFAULT_EMAIL']], :subject => subject)
  end
  
  def send_task_acceptance_email(sender_email, recipient_email, subject, flash_team_name, task_member, task_name, project_overview, task_description, all_inputs, input_link, outputs, output_description, task_duration, foundry_url)
  
  	#@message = message.html_safe
  	@flash_team_name = flash_team_name
  	@task_member = task_member
  	@task_name = task_name
  	@project_overview = project_overview
  	@task_description = task_description
  	@all_inputs = all_inputs
  	@input_link = input_link
  	@outputs = outputs
  	@output_description = output_description
  	@task_duration = task_duration
  	@foundry_url = foundry_url
  		    	  
  	mail(:from => sender_email, :bcc => [recipient_email, ENV['DEFAULT_EMAIL']], :subject => subject)
  end
  
  def send_task_rejection_email(sender_email, recipient_email, subject, flash_team_name, task_member, task_name)
  
  	#@message = message.html_safe
  	@flash_team_name = flash_team_name
  	@task_member = task_member
  	@task_name = task_name
  		    	  
  	mail(:from => sender_email, :bcc => [recipient_email, ENV['DEFAULT_EMAIL']], :subject => subject)
  end

  def send_first_in_queue(email, task_member, task_name, flash_team_name, wait_time, removalURL, task_duration, project_overview, task_description, inputs, input_link, outputs, output_description, invitationLink)
    @task_member = task_member
    @task_name = task_name
    @flash_team_name = flash_team_name
    @wait_time = wait_time
    @removalURL = removalURL
    @task_duration = task_duration
    @project_overview = project_overview
    @task_description = task_description
    @inputs = inputs
    @outputs = outputs
    @input_link = input_link
    @output_description = output_description
    @invitationLink = invitationLink
    mail(:to => email, :subject => task_member + ' role for the ' + task_name + ' task now available')
  end

  def send_edit_team_request_email(flash_team_name, request_text)
  
    #@message = message.html_safe
    @flash_team_name = flash_team_name
    @request_text = request_text
              
    mail(:to => ENV['DEFAULT_EMAIL'], :subject => 'Requested change to the ' + @flash_team_name + ' project')
  end

  
end