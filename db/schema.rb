# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150421224539) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activity_logs", force: true do |t|
    t.string   "activity_type"
    t.string   "act_tstamp"
    t.text     "current_user"
    t.string   "chat_name"
    t.integer  "team_id"
    t.text     "activity_json"
    t.string   "update_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "collaborations", force: true do |t|
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "flash_teams", force: true do |t|
    t.string   "name"
    t.string   "author"
    t.text     "json"
    t.text     "status"
    t.text     "notification_email_status"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "original_status"
    t.integer  "user_id"
  end

  create_table "handoffs", force: true do |t|
    t.text     "description"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "landings", force: true do |t|
    t.integer  "id_team"
    t.integer  "id_event"
    t.string   "task_member"
    t.string   "email"
    t.datetime "start_date_time"
    t.datetime "end_date_time"
    t.integer  "queuePosition"
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "uniq"
    t.boolean  "emailSent"
    t.datetime "emailSentTime"
  end

  create_table "members", force: true do |t|
    t.string   "name"
    t.string   "color"
    t.string   "email"
    t.string   "uniq"
    t.string   "confirm_email_uniq"
    t.boolean  "email_confirmed"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "confirmationTime"
  end

  create_table "sessions", force: true do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "skills", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "subcategories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tasks", force: true do |t|
    t.string   "title"
    t.integer  "start_hour"
    t.integer  "end_our"
    t.integer  "start_minute"
    t.integer  "end_minute"
    t.integer  "duration"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "username"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "workers", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "panel"
    t.string   "skype_username"
    t.string   "odesk_url"
    t.string   "timezone_utc"
    t.text     "additional_info"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
