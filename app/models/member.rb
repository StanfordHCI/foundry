class Member < ActiveRecord::Base
  belongs_to :flash_team
  belongs_to :category
  belongs_to :subcategory
  has_and_belongs_to_many :tasks
  has_and_belongs_to_many :skills
end