require 'json'

class MembersController < ApplicationController
  def invite

    uniq = params[:uniq]
    if !uniq
      uniq = SecureRandom.uuid
    end

    # generate unique id and add to url below
    url = url_for :action => 'invited', :id => params[:id], :uniq => uniq
    
    #UserMailer.send_email(email, url).deliver

    respond_to do |format|
      format.json {render json: {:url => url, :uniq => uniq}.to_json, status: :ok}
    end
  end

  def reInvite

    prev_uniq = params[:uniq]
    uniq = SecureRandom.uuid
    
    member = Member.where(:uniq => prev_uniq)[0]
    if member  != nil
      member.name = nil
      member.color = nil
      member.email = nil
      member.confirm_email_uniq = nil
      member.email_confirmed = nil
      member.uniq = nil
      member.save
    end
    
    # generate unique id and add to url below
    url = url_for :action => 'invited', :id => params[:id], :uniq => uniq
    
    #UserMailer.send_email(email, url).deliver

    respond_to do |format|
      format.json {render json: {:url => url, :uniq => uniq}.to_json, status: :ok}
    end
  end

  def invited_by_hiring_queue
    email = params[:email]
    uniq = params[:uniq]
    id = params[:id_team]
    if not uniq
      render 'error'
    end

    # register member, with no confirmation email sent out
    # since it is assumed the current user entered the system from their email to begin with
    member, ok = register_helper(id, "new member", email, uniq, false)
    if !ok
      puts "failed to register new member"
      return
    end

    member.email_confirmed = true
    member.confirmationTime = Time.now
    if member.save
      # send email with link to team
      url = url_for :controller => 'flash_teams', :action => 'edit', :id => id, :uniq => uniq
      UserMailer.send_team_link_email(member.name, email, url).deliver
      
      # redirect user to team directly
      login(uniq)
    end
  end

  def invited
  	@uniq = params[:uniq]
  	@id = params[:id]
  	if not @uniq
  		render 'error'
  	end

  	# already confirmed email, so log in user and redirect to flash team page
  	if check_email_confirmed(@uniq)
  		login(@uniq)
  	end
  end

  def confirm_email
    first = Landing.new
    @count = 0
    id = params[:id]
    uniq = params[:u]
    confirm_email_uniq = params[:cu]
    email = params[:email]
    member = Member.where(:uniq => uniq, :confirm_email_uniq => confirm_email_uniq)[0]
    queue = Landing.where(:id_team=>id, :status=>'p', :uniq=>uniq).order('created_at')
    if not(queue.empty?) then
      first = queue[0]
    end

    emails1 = Landing.where(:id_team=>id, :uniq=>uniq, :status=>'s')
    if emails1.empty? 
      member.email_confirmed = true
      member.confirmationTime = Time.now
      member.save
    else
      if first.email != email
        @count = -1
        return
      else
        member.email_confirmed = true
        member.confirmationTime = Time.now
        member.save
      end
    end

    if member.email_confirmed then 
      url = url_for :controller => 'flash_teams', :action => 'edit', :id => id, :uniq => uniq
      UserMailer.send_team_link_email(member.name, email, url).deliver
      
      login(uniq)
    end
  end

  def login uniq
  	session[:uniq] = uniq
  	redirect_to :controller => 'flash_teams', :action => 'edit', :id => params[:id], :uniq => uniq
  end

  def check_email_confirmed uniq
    member = Member.where(:uniq => uniq)[0]
    (member != nil and member.email_confirmed)
  end

  def register_helper id, name, email, uniq, send_email
    emails = Landing.where(:id_team=>id, :email=>email, :uniq=>uniq, :status=>'s')
    emails1 = Landing.where(:id_team=>id, :uniq=>uniq, :status=>'s')
    
    if emails1.empty? or !emails.empty?
      confirm_email_uniq = SecureRandom.uuid
      # store email, uniq and confirm_email_uniq in db
      member = Member.create(:name => name, :email => email, :uniq => uniq, :confirm_email_uniq => confirm_email_uniq)
      
      if send_email # send confirmation email
        url = url_for :action => 'confirm_email', :id => params[:id], :u => uniq, :cu => confirm_email_uniq, :email => email
        UserMailer.send_confirmation_email(name, email, url).deliver
      end
      
      return member, true
    end
    
    return nil, false
  end

  def register
    id = params[:id]
    name = params[:name]
    email = params[:email]
    uniq = params[:uniq]
    @uniq = uniq
    
    member, ok = register_helper(id, name, email, uniq, true)
    if !ok
      flash.alert = "The email address does not match our records. Please check and retry."
      redirect_to :back
    end
  end
end