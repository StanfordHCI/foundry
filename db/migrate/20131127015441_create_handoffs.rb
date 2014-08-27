class CreateHandoffs < ActiveRecord::Migration
  def change
    create_table :handoffs do |t|
      t.text :description
      t.string :type

      t.timestamps
    end
  end
end
