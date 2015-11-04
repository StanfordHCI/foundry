require 'json'

namespace :flash_teams do
  desc "Separate flesh team json to several models."
  task separate: :environment do
    FlashTeam.all.each do |team|
      if team.status.present?
        team_json = OpenStruct.new(JSON.parse(team.status)['flash_teams_json'])
        team.tasks.destroy_all
        if team_json && team_json.events.present?
          print "#{team.name} ["
          team_json.events.each do |event|
            team.tasks.create! data_json: event.to_json
            print "\e[32m.\e[0m"
          end
          print "]\n"
        end
      end
    end
  end
end
