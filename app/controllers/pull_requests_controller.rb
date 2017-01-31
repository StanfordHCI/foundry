class PullRequestsController < ApplicationController
  before_filter :authenticate!, only: [:show, :index, :create, :update, :destroy]
  
  # GET
  def show
    @pull_request = PullRequest.find(params[:id])
  end

  def index
    render json: PullRequest.all, status: :ok
  end

  def get_as_json
    pr = PullRequest.find(params[:id])
    puts "retrieving pr for merge:"
    puts pr.to_json
    puts ""
    render json: pr, status: :ok
  end

  # POST
  def create
    pr = PullRequest.new(ancestor_json: params[:ancestor_json], parent_team_id: params[:parent_team_id])
    pr.timestamp = Time.now()
    pr.author_id = session[:user_id]
    if pr.save
      render json: pr, status: :ok
    else
      render json: { errors: pr.errors.full_messages }, status: 500
    end
  end

  def update
    pr = PullRequest.find(params[:id])
    pr.new_json = params[:new_json]
    puts "updating new_json on backend"
    puts pr.new_json
    puts ""
    pr.notes = params[:notes]
    if pr.save
      render json: pr, status: :ok
    else
      render json: { errors: pr.errors.full_messages }, status: 500
    end
  end

  def destroy
    pull_request = PullRequest.find(params[:id])
    pull_request.destroy!

    render json: nil, status: :ok
  end

  private

  def update_params
    params.permit(:new_json, :ancestor_json, :status, :notes)
  end
  def create_params
    params.permit(:new_json, :ancestor_json, :parent_team_id)
  end
end