# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_11_19_120703) do

  create_table "bots", force: :cascade do |t|
    t.string "name"
    t.integer "phone"
    t.string "language"
    t.string "initconv"
    t.string "triggerpoint"
    t.time "starttime"
    t.time "endtime"
    t.date "startdate"
    t.date "enddate"
    t.integer "rebootconv"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "user_id"
    t.string "days"
    t.string "status"
    t.string "reminder"
    t.string "conversation"
  end

  create_table "languages", force: :cascade do |t|
    t.string "language"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "messages", force: :cascade do |t|
    t.text "text_message"
    t.string "node_type"
    t.integer "node_id"
    t.integer "bot_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "nodes", force: :cascade do |t|
    t.string "node_type"
    t.integer "bot_id"
    t.integer "parent_id"
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "set_next_action"
    t.text "exit_message"
    t.string "user_input_type"
    t.boolean "exit_message_toggle_switch"
    t.text "transfer_message"
    t.boolean "transfer_message_toggle_switch"
  end

  create_table "reminders", force: :cascade do |t|
    t.text "reminder"
    t.integer "bot_id"
    t.integer "rebootconv"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "triggerphrases", force: :cascade do |t|
    t.string "trigger"
    t.integer "bot_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
