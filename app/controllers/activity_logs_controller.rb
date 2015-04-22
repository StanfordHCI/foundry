class ActivityLogsController < ApplicationController
  #protected
  def new
    @activity_log = ActivityLog.new
  end
  def create
    @activity_log = ActivityLog.create(activity_log_params)
  end

  def log_update

    #oname = Object.obj_name(@thingy.id)
    #log_msg = "id: #{@thingy.id}\n#{oname}\ndescription: #{@thingy.description}"
    #ActivityLog.create(:item_type => controller_name.classify, :item_id => @thingy.id, :act_action => action_name, :updated_by => current_user.username, :activity => log_msg, :act_tstamp => Time.now)
  	
  	@activity_log = ActivityLog.create(:activity_type => params[:activity_type], :act_tstamp => params[:act_tstamp], :current_user => params[:current_user], :chat_name => params[:chat_name], :team_id => params[:team_id], :activity_json => params[:activity_json], :update_type => params[:update_type])
  	# if @activity_log.save 
  	# 	respond_to do |format|
   #    		format.json {render json: "saved".to_json, status: :ok}
   #  	end
   #  end
  end

  def activity_log_params params
    params.permit(:activity_type, :act_tstamp, :current_user, :chat_name, :team_id, :activity_json, :type)
  end

end