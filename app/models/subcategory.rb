class Subcategory < ActiveRecord::Base
  has_many :members
  belongs_to :category
end
