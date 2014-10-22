class CreateWorkers < ActiveRecord::Migration
  def change
    create_table :workers do |t|
      t.string :name
      t.string :email
      t.string :panel
      t.string :skype_username
      t.string :odesk_url
      t.string :timezone_utc
      t.text :additional_info

      t.timestamps
    end
  end
end
