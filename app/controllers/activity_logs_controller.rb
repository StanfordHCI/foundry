class ActivityLogsController < ApplicationController
  #protected
  def new
    @activity_log = ActivityLog.new
  end
  def create
    @activity_log = ActivityLog.create(activity_log_params)
  end

  def log_update
  	@activity_log = ActivityLog.create(:activity_type => params[:activity_type], :act_tstamp => params[:act_tstamp], :current_user => params[:current_user], :chat_name => params[:chat_name], :team_id => params[:team_id], :activity_json => params[:activity_json], :update_type => params[:update_type])
  end

  def activity_log_params params
    params.permit(:activity_type, :act_tstamp, :current_user, :chat_name, :team_id, :activity_json, :type)
  end

end