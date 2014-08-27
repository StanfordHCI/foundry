class Task < ActiveRecord::Base
	belongs_to :flash_team
  has_and_belongs_to_many :members
  has_and_belongs_to_many :handoffs
  has_and_belongs_to_many :collaborations
end
