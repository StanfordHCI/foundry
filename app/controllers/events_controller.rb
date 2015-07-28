class EventsController < ApplicationController
  before_filter :valid_user?

  def create
    @task = flash_team.tasks.create(data_json: params[:event].permit!)
    render json: @task.data_json
  end

  def destroy
    Task.find(params[:id]).destroy
    render json: {id: params[:id]}
  end

  protected

  def flash_team
    @flash_team||= FlashTeam.find params[:flash_team_id]
  end
end
