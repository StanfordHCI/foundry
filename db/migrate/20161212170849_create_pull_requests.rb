class CreatePullRequests < ActiveRecord::Migration
  def change
    create_table :pull_requests do |t|
      t.references :parent_team, references: :flash_team, index: true, foreign_key: true
      t.json :new_json
      t.json :ancestor_json
      t.integer :status, default: 0
      t.string :notes
      t.references :author, references: :user, index: true, foreign_key: true
      t.timestamp :timestamp
    end
  end
end
