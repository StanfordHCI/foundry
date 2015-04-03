class AddUniq < ActiveRecord::Migration
def change
add_column :landings, :uniq, :string
Landing.reset_column_information
Landing.all.each do |landing|
landing.update_attributes!(:uniq => landing.email)
end
end
end
