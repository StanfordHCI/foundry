class LandingsController < ApplicationController
  def view
    if params[:starter_task] == "true"
      @starter_task = true
    else
      @starter_task = "false"
    end
    @id_team = params[:id]
    @id_task = params[:event_id].to_i
    @flash_team = FlashTeam.find(params[:id])
    # Extract data from the JSON
    flash_team_status = JSON.parse(@flash_team.status)
    @flash_team_json = flash_team_status['flash_teams_json']
    @flash_team_event = @flash_team_json['events'][@id_task]
    @flash_team_name = @flash_team_json['title']
    #tm = params[:task_member].split(',') role of recipient 
    @task_member = params[:task_member]
    @email = params[:email]
    @start_date_time = Time.now
    @end_date_time = Time.now + 600
    @queuePosition = 0
    @wait_time = ""
    wait_time = 0
    @removalURL = url_for :controller=>'landings', :action=>'remove', :id=>@id_team, :event_id=>@id_task, :task_member=>@task_member, :email=>@email
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

    @task_members = Array.new
    @flash_team_event['members'].each do |task_member|
      @task_members << getMemberById(@id_team, @id_task, task_member)
    end

    if @id_team.nil? or @id_team.to_i<=0 or @id_task.nil? or @id_task.to_i<0 or @email=="" or @email.nil? or @task_member.nil? or @task_member==""
      @queuePosition = -1
      return
    end

    @invitationLink = ""
    @uniq = ""

    @task_members.each do |task_member|
      if task_member['role'] == @task_member
        @uniq = task_member['uniq']
        @invitationLink = url_for :controller => 'members', :action => 'invited_by_hiring_queue', :id_team => @id_team, :uniq => @uniq, :email => @email
        break
      end
    end

    emails = Array.new
    emails = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :email=>@email, :status=>'s')
    emails1 = Array.new
    emails1 = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'s')
    if not (emails1.empty?) then
      if emails.empty? 
        @queuePosition = -1
        return
      end
    end

    uniq1 = params[:uniq]
    if uniq1!=@uniq 
      @queuePosition = -2
      l = Landing.where(:uniq => uniq1)
      l.destroy_all
      return
    end

    @relevantLanding1 = Array.new
    @relevantLanding1 = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'p')

    for l in @relevantLanding1
      m = Array.new
      m = Member.where(:email=>l.email, :uniq=>@uniq) 
      if not(m.empty?) then
        for t in m
          if t.email_confirmed 
            l.status = 'p'
            l.save
            return
          elsif Time.now>l.end_date_time
            l.status = 'd'
            l.save
          end
        end
      elsif Time.now>l.end_date_time
        l.status = 'd'
        l.save
      end
    end

    @relevantLanding = Array.new
    @relevantLanding = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'p').order('created_at')

    alreadyPresent = 0

    count = 0
    for l in @relevantLanding
      if l.email == @email then 
        alreadyPresent = 1 
        count = count+1
        break
      end
      count = count+1
    end

    if alreadyPresent == 0
      @queuePosition = @relevantLanding.length + 1
    else
      @queuePosition = count
    end

    if @queuePosition == 1 and @relevantLanding.length == 0
      wait_time = 0
    elsif @queuePosition == 1 
      wait_time = @relevantLanding[@queuePosition-1].end_date_time-Time.now
    else
      wait_time = @relevantLanding[@queuePosition-2].end_date_time-Time.now
    end

    hh, mm = wait_time.divmod(60)
    @wait_time = hh.to_s 
    if hh==1
      @wait_time += " minute"
    else
      @wait_time += " minutes"
    end
    if mm>0
      @wait_time += " and " + mm.to_i.to_s + " seconds"
    end

    if @queuePosition == 1 and @relevantLanding.length == 0 then
      @wait_time = '10 minutes'
    end

    if alreadyPresent == 0 
      @newLanding = Landing.new
      @newLanding.id_team = @id_team
      @newLanding.id_event = @id_task
      @newLanding.task_member = @task_member
      @newLanding.email = @email
      @newLanding.start_date_time = @start_date_time
      @newLanding.end_date_time = @end_date_time + wait_time
      @newLanding.queuePosition = @queuePosition
      @newLanding.status = 'p'
      deletedLanding = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'d').order('created_at')
      if @queuePosition == 1 and deletedLanding.length>0
        UserMailer.send_first_in_queue(@email, @task_member, @task_name, @flash_team_name, @wait_time, @removalURL, @task_duration, @project_overview, @task_description, @inputs, @input_link, @outputs, @output_description, @invitationLink).deliver
        @newLanding.emailSent = true
        @newLanding.emailSentTime = Time.now
      end
      @newLanding.uniq = @uniq
      @newLanding.save 
    else
      @relevantLanding = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'p').order('created_at')
      deletedLanding = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'d').order('created_at')
      if @queuePosition == 1 and not(@relevantLanding[0].emailSent) and deletedLanding.length>0
        UserMailer.send_first_in_queue(@email, @task_member, @task_name, @flash_team_name, @wait_time, @removalURL, @task_duration, @project_overview, @task_description, @inputs, @input_link, @outputs, @output_description, @invitationLink).deliver
        @relevantLanding[0].emailSent = true
        @relevantLanding[0].emailSentTime = Time.now
        @relevantLanding[0].save
      end
      return
    end
  @relevantLanding = Landing.where(:id_team=>@id_team, :id_event=>@id_task, :task_member=>@task_member, :status=>'p').order('created_at')
  end

  def remove
    timeDifference = 0
    @id_team = params[:id]
    @id_task = params[:event_id].to_i
    @task_member = params[:task_member]
    @email = params[:email]
    r = Landing.where(:id_team => @id_team, :id_event => @id_task, :task_member => @task_member, :status => 'p').order('created_at')
    index = 0
    for l in r
      if l.email == @email
        deletedTime = l.end_date_time
        l.status = 'd'
        l.save
        break
      end
      index = index+1
    end

    s = Landing.where(:id_team => @id_team, :id_event => @id_task, :task_member => @task_member, :status => 'p').order('created_at')
    if s.length>index
      if index == 0
        for i in index..s.length-1
          s[i].end_date_time = Time.now + 600*(i+1)
          s[i].save
        end

      else
        timings = Array.new
        timings<<deletedTime
        for i in index..s.length-1
          timings<<s[i].end_date_time
        end

        count = 0
        for i in index..s.length-1
          s[i].end_date_time = timings[count]
          s[i].save
          count = count+1
        end
      end
    end
  end
end
