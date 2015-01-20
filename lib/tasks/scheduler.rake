require 'json'
require 'socket'

namespace :notification do
  desc "Send notification emails when a task is delayed."
  task email_delayed_task: :environment do
   
   #include ActionDispatch::Routing::UrlFor
   #include Rails.application.routes.url_helpers

   #change default_url_option to current host
   #default_url_options[:host] = 'flashteams.herokuapp.com'
   #default_url_options[:host] = 'localhost:3000'
   

   #default_url = 'foundry-app-dev.herokuapp.com'
   default_url = ENV['DEFAULT_URL']
   
   #script should be scheduled to run every call_period seconds
   #call_period= 10 * 60 #minutes [TODO change back]
   call_period= 1 * 60 #sec [TODO change back to 600]
   puts "checking if a task is delayed..."

   
    cur_time= (Time.now.to_f * 1000).to_i
         
    #print Member.where(:name => "negar 1")[0]
    members = Member.all
    
    flash_teams = FlashTeam.all
   	flash_teams.each do |flash_team|
      
      ## intialize
      next if flash_team.status == nil
      
      flash_team_status = JSON.parse(flash_team.status)
           	
      flash_team_json=flash_team_status["flash_teams_json"]
      flash_team_members=flash_team_json["members"]
      
      print "Checking flash team number: "
      print flash_team_json["id"]
      puts "\n"
      
      
      ##jump to next team if team is not started yet
      print "in progress status: "
      print flash_team_json["in_progress"]

      #next if flash_team_json["in_progress"] != true

      #After pushing end button, members array is emptied
      if flash_team_members.length == 0
          flash_team.notification_email_status = JSON.dump([])
          flash_team.save
      end
      
      next if flash_team_members.length == 0
      
      #delayed_tasks_time=flash_team_status["delayed_tasks_time"]
      
      #dri_responded=flash_team_status["dri_responded"]
      if flash_team.notification_email_status != nil
        notification_email_status = JSON.parse(flash_team.notification_email_status)
      else
        notification_email_status=[]
      end
     
      flash_team_events=flash_team_json["events"]      
      #delayed_tasks_num=flash_team_status["delayed_tasks"]
      #remaining_tasks = flash_team_status["remaining_tasks"]
      #live_tasks = flash_team_status["live_tasks"]

      #get members of live and remaining tasks
      #roles_remaining_live=[];

     # remaining_tasks.each do |remaining_task|
      #   groupNum = remaining_task;
       #  flash_team_events.each do |event|
        #  eventId = event["id"];
         # if eventId == groupNum
          #  event["members"].each do |member_id|
           #   if event["members"].length == 0
            #    print "error: delayed event has no members\n"
             #   break
              #end
              #member = flash_team_members.detect{|m| m["id"].to_i == member_id.to_i};    
              #if roles_remaining_live.index(member)==nil
              #  roles_remaining_live.push(member);
              #end
            #end
          #end
        #end
      #end
      
      #live_tasks.each do |remaining_task|
      #   groupNum = remaining_task;
   
      

      #/get index of delayed event in events array/    
      flash_team_events.each do |delayed_event|
        #start_time= delayed_tasks_time[groupNum]
        #get delay sart time
        #delayed_event = flash_team_events.detect{|ev| ev["id"].to_i == groupNum.to_i}        
        next if delayed_event["status"] != "delayed"
        
        groupNum = delayed_event["id"]
        # end get delay start time
        #delta_time_sec= (cur_time.to_i - start_time.to_i)/1000
        delta_time_sec = -1 * delayed_event["timer"];
        
        print "elapsed time: \n "
        print delta_time_sec 

        #if scheduler is called before 1 call period an email is sent to the autor
        # the author should estimate the delay and all other workers will automatically get informed of the delay
        if delta_time_sec<=call_period
          #flash_team_events.each do |event|
            eventId = groupNum;
          #  if eventId == groupNum
              /send email to dri/
              #delayed_event=event
             
              if delayed_event["members"].length == 0
                print "error: delayed event has no members\n"
                break
              end

              dri =  delayed_event["dri"]
              dri_member= flash_team_members.detect{|m| m["id"].to_i == dri.to_i}
              if dri_member  == nil
                puts "dri is not defined"
                #set the first member as the dri and email the first member
                dri_member= flash_team_members.detect{|m| m["id"].to_i == delayed_event["members"][0].to_i}
              end
              next if dri_member  == nil

              dri_role=dri_member["role"]
              event_name= delayed_event["title"]
              
              event_id=eventId
              team_id=flash_team_json["id"]
              
              #url = url_for :controller => 'flash_teams',:action => 'delay',:id =>team_id.to_s, :event_id => event_id.to_s
              url = default_url+"/flash_teams/"+team_id.to_s+"/"+event_id.to_s+"/delay"
              member_id= dri_member["id"]
              #dri_event = delayed_event["members"].detect{|m| m["name"] == dri_role}
             
            # if dri_event  == nil
             #   print "dri_event is nil"
             #   next
             # end

              dri_uniq = dri_member["uniq"]
              next if dri_uniq == nil
              
              #get array of emails to be CCed. (All the members of the team are CCed)
              cc_emails=[]
              #print delayed_event["members"]
              delayed_event["members"].each do |cc_member_id|
                 #cc_uniq = cc_member["uniq"]
                 cc_member = flash_team_members.detect{|m| m["id"].to_i == cc_member_id.to_i}
                 cc_uniq = cc_member["uniq"]
                 
                 next if Member.where(:uniq => cc_uniq.to_s)[0] == nil

                 cc_emails.push(Member.where(:uniq => cc_uniq.to_s)[0].email)
              end
              #print "list of CCed emails: "
              #print cc_emails

              #email_dri = Member.where(:uniq => dri_uniq)[0].email
              if Member.where(:uniq => dri_uniq.to_s)[0]==nil
                puts "dri has not entered information yet"
                next
              end
              
              email_dri = Member.where(:uniq => dri_uniq.to_s)[0].email
              if email_dri == nil
                puts "dri has not entered email yet"
                next
              end
              UserMailer.send_dri_on_delay_email(email_dri,event_name, dri_role,url,team_id,event_id,cc_emails).deliver
              break
           # end
          #end
        end
        #finished sending email to dri to ask for the delay
        
        
        #DRI has not responded yet, send email to members of remaining tasks
        #todo
        if delta_time_sec >= (1 * call_period) && delta_time_sec < (2 * call_period)
        #if delta_time_sec >= (2 * call_period)
          
          #???
          if notification_email_status[groupNum-1]== nil
            #flash_team_events.each do |event|
            eventId = groupNum;
            #if eventId == groupNum
            #    delayed_event=event
                if delayed_event["members"].length == 0
                  print "error: delayed event has no members\n"
                break
                end
                event_name= delayed_event["title"]
                
                dri =  delayed_event["dri"]
                dri_member = flash_team_members.detect{|m| m["id"] == dri.to_i}
                if dri_member  == nil
                  puts "dri is not defined"
                  dri_member= flash_team_members.detect{|m| m["id"].to_i == delayed_event["members"][0].to_i}
                end
                if dri_member  == nil
                  print "dri is nill\n"
                  next
                end
                dri_role=dri_member["role"]
                

                event_id=eventId
                team_id=flash_team_json["id"]
                
                roles_remaining_live = []
                
                if (delayed_event["events_after"] == nil)
                  break;
                end

                delayed_event["events_after"].each do |event_after_id|
                  event_after = flash_team_events.detect{|ev| ev["id"].to_i == event_after_id.to_i}        

                  if event_after["members"].length == 0
                    print "error: following event has no members\n"
                    break
                  end 
                  event_after["members"].each do |member_id|   
                    member = flash_team_members.detect{|m| m["id"].to_i == member_id.to_i};    
                    if roles_remaining_live.index(member)==nil
                      roles_remaining_live.push(member);
                    end
                  end  
                end
              
                if roles_remaining_live == [] 
                  break
                end

                roles_remaining_live.each do |role|
                  uniq = role["uniq"]
                 
                  if Member.where(:uniq => uniq.to_s)[0]==nil
                    puts "dri has not entered information yet"
                    next
                  end
                  
                  email = Member.where(:uniq => uniq.to_s)[0].email
                  if email == nil
                    puts "member does not have email"
                    next
                  end
                  
                  UserMailer.send_delayed_dri_not_responded(email,event_name,dri_role).deliver;   
                end
                break
             # end
            #end
          end
        end
      end
    end
  end
end

