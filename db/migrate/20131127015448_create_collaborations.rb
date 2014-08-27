class CreateCollaborations < ActiveRecord::Migration
  def change
    create_table :collaborations do |t|
    	t.text :description

      t.timestamps
    end
  end
end
