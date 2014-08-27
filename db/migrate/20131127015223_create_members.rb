class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :name
      t.string :color
      t.string :email
      t.string :uniq
      t.string :confirm_email_uniq
      t.boolean :email_confirmed

      t.timestamps
    end
  end
end
