class AddEmailSentTime < ActiveRecord::Migration
def change
add_column :landings, :emailSent, :boolean
add_column :landings, :emailSentTime, :datetime
add_column :members, :confirmationTime, :datetime
Landing.reset_column_information
Landing.all.each do |landing|
landing.update_attributes!(:emailSent => false)
end
Member.reset_column_information
Member.all.each do |member|
member.update_attributes!(:confirmationTime => Time.now)
end
end
end
