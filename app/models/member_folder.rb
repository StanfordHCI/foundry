class MemberFolder < ActiveRecord::Base
    belongs_to :flash_team, :member_folder
    has_many :member_folders, :members
end
