require 'slack'

class SlackController < ApplicationController
  def callback
    client = Slack::Client.new
    response = client.oauth_access(
      client_id: ENV['SLACK_APP_CLIENT_ID'],
      client_secret: ENV['SLACK_APP_CLIENT_SECRET'],
      code: params[:code],
      redirect_uri: "http://foundry-app-dev.herokuapp.com/slack/auth/"
    )
    flash[:slack_info] = response
    redirect_to params[:state]
  end
end
