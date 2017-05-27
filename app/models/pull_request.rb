class PullRequest < ActiveRecord::Base
    belongs_to :flash_team
    belongs_to :user

    validates :parent_team_id, presence: true
    validates :status, presence: true
    validates :author_id, presence: true
    validates :timestamp, presence: true
end
