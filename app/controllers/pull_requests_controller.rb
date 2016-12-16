class PullRequestsController < ApplicationController
  before_filter :authenticate!, only: [:show, :index, :create, :update, :destroy]
  
  # GET
  def show
    @pull_request = PullRequest.find(params[:id])
  end

  def index
    render json: PullRequest.all, status: :ok
  end

  # POST
  def create
    pr = PullRequest.new(create_params)
    pr.timestamp = Time.now()
    pr.author_id = session[:user_id]
    if pr.save
      render json: pr, status: :ok
    else
      render json: { errors: pr.errors.full_messages }, status: 500
    end
  end

  def update
    pull_request = PullRequest.find(params[:id])
    if pull_request.update!(update_params)
      render json: pull_request, status: :ok
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