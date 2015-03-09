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

  def invited
  	uniq = params[:uniq]
    @uniq = params[:uniq]
  	@id = params[:id]
  	if not uniq
  		render 'error'
  	end

  	# already confirmed email, so log in user and redirect to flash team page
  	if check_email_confirmed(uniq)
  		login(uniq)
  	end
  end

  def confirm_email
    uniq = params[:u]
    confirm_email_uniq = params[:cu]
    member = Member.where(:uniq => uniq, :confirm_email_uniq => confirm_email_uniq)[0]
    member.email_confirmed = true
    member.save

    login(uniq)
  end

  def login uniq
  	session[:uniq] = uniq
  	redirect_to :controller => 'flash_teams', :action => 'edit', :id => params[:id], :uniq => uniq
  end

  def check_email_confirmed uniq
    member = Member.where(:uniq => uniq)[0]
    (member != nil and member.email_confirmed)
  end

  def register
    id = params[:id]
    name = params[:name]
    email = params[:email]
    uniq = params[:uniq]
    @count = 0
    emails = Array.new
    emails = Landing.where(:id_team=>id, :email=>email)
    if emails.empty? 
      return
    else
      @count = 1
    end

    confirm_email_uniq = SecureRandom.uuid
    
    # store email, uniq and confirm_email_uniq in db
    member = Member.create(:name => name, :email => email, :uniq => uniq, :confirm_email_uniq => confirm_email_uniq)

    # send confirmation email
    url = url_for :action => 'confirm_email', :id => params[:id], :u => uniq, :cu => confirm_email_uniq
    UserMailer.send_confirmation_email(name, email, url).deliver
  end
end