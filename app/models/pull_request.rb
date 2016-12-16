class PullRequest < ActiveRecord::Base
    belongs_to :flash_team
    belongs_to :user

    validates :parent_team_id, presence: true
    validates :new_json, presence: true
    validates :ancestor_json, presence: true
    validates :status, presence: true
    validates :author_id, presence: true
    validates :timestamp, presence: true

    enum status: {
        created: 0,
        conflicts: 1,
        merged: 2,
        rejected: 3,
        canceled: 4
    }
end
