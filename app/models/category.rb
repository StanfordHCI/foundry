class Category < ActiveRecord::Base
  has_many :members
  has_many :subcategories
end
