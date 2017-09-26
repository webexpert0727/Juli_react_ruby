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

ActiveRecord::Schema.define(version: 20170915122143) do

  create_table "enrollment_statuses", force: :cascade do |t|
    t.string   "enrollment_status_name", limit: 255
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
  end

  create_table "farms", force: :cascade do |t|
    t.string   "farm_name",         limit: 255
    t.string   "farm_name2",        limit: 255
    t.string   "address",           limit: 255
    t.string   "address2",          limit: 255
    t.integer  "farm_tax",          limit: 4
    t.integer  "tax_id",            limit: 4
    t.string   "logo",              limit: 255
    t.string   "blob",              limit: 255
    t.string   "website",           limit: 255
    t.string   "email",             limit: 255
    t.string   "invoicecc_email",   limit: 255
    t.string   "client_code",       limit: 255
    t.string   "user_date_format",  limit: 255
    t.string   "currency_symbol",   limit: 255
    t.string   "currency_code",     limit: 255
    t.integer  "date_format_id",    limit: 4
    t.integer  "number_format_id",  limit: 4
    t.integer  "invoice_start_num", limit: 4
    t.text     "invoice_notes",     limit: 65535
    t.boolean  "active",            limit: 1
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "forget_password_requests", force: :cascade do |t|
    t.integer  "request_id", limit: 4
    t.string   "useremail",  limit: 255
    t.string   "resetcode",  limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "forget_password_requests", ["request_id"], name: "index_forget_password_requests_on_request_id", using: :btree

  create_table "horses", force: :cascade do |t|
    t.string   "horse_name", limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "instructors", force: :cascade do |t|
    t.integer  "person_id",       limit: 4
    t.string   "instructor_name", limit: 255
    t.integer  "ssn",             limit: 4
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.integer  "user_id",         limit: 4
  end

  add_index "instructors", ["person_id"], name: "index_instructors_on_person_id", using: :btree

  create_table "invoices", force: :cascade do |t|
    t.datetime "invoice_date"
    t.integer  "student_id",   limit: 4
    t.integer  "paid",         limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "invoices", ["student_id"], name: "index_invoices_on_student_id", using: :btree

  create_table "items", force: :cascade do |t|
    t.integer  "student_id",      limit: 4
    t.integer  "product_id",      limit: 4
    t.integer  "start_count",     limit: 4
    t.integer  "remain_count",    limit: 4
    t.datetime "startdate"
    t.datetime "expiry_date"
    t.integer  "renew",           limit: 4
    t.float    "price",           limit: 24
    t.integer  "quantity",        limit: 4
    t.integer  "tax",             limit: 4
    t.float    "discount",        limit: 24
    t.text     "item_notes",      limit: 65535
    t.integer  "related_item_id", limit: 4
    t.integer  "invoice_id",      limit: 4
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "items", ["invoice_id"], name: "index_items_on_invoice_id", using: :btree
  add_index "items", ["product_id"], name: "index_items_on_product_id", using: :btree
  add_index "items", ["student_id"], name: "index_items_on_student_id", using: :btree

  create_table "lesson_date_time_horses", force: :cascade do |t|
    t.integer  "lesson_date_time_id", limit: 4
    t.integer  "horse_id",            limit: 4
    t.text     "notes",               limit: 65535
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
  end

  add_index "lesson_date_time_horses", ["horse_id"], name: "index_lesson_date_time_horses_on_horse_id", using: :btree
  add_index "lesson_date_time_horses", ["lesson_date_time_id"], name: "index_lesson_date_time_horses_on_lesson_date_time_id", using: :btree

  create_table "lesson_date_time_series", force: :cascade do |t|
    t.integer  "frequency",          limit: 4,     default: 1
    t.string   "period",             limit: 255,   default: "week"
    t.datetime "starttime"
    t.datetime "endtime"
    t.string   "repeat_end_status",  limit: 255
    t.text     "week_recuring_days", limit: 65535
    t.boolean  "all_day",            limit: 1,     default: false
    t.datetime "created_at",                                        null: false
    t.datetime "updated_at",                                        null: false
    t.integer  "user_id",            limit: 4
  end

  add_index "lesson_date_time_series", ["user_id"], name: "index_lesson_date_time_series_on_user_id", using: :btree

  create_table "lesson_date_times", force: :cascade do |t|
    t.string   "name",                       limit: 255
    t.datetime "scheduled_date"
    t.time     "scheduled_starttime"
    t.integer  "duration",                   limit: 4
    t.time     "scheduled_endtime"
    t.integer  "instructor_id",              limit: 4
    t.integer  "location_id",                limit: 4
    t.integer  "default_product_id",         limit: 4
    t.integer  "max_enrollment",             limit: 4
    t.integer  "number_scheduled",           limit: 4
    t.integer  "section_id",                 limit: 4
    t.integer  "lesson_status_id",           limit: 4
    t.text     "lesson_notes",               limit: 65535
    t.string   "stringnum",                  limit: 255
    t.integer  "farm_id",                    limit: 4
    t.datetime "created_at",                                               null: false
    t.datetime "updated_at",                                               null: false
    t.datetime "scheduled_end_date"
    t.integer  "user_id",                    limit: 4
    t.integer  "lesson_date_time_series_id", limit: 4
    t.boolean  "is_recuring",                limit: 1,     default: false
  end

  add_index "lesson_date_times", ["farm_id"], name: "index_lesson_date_times_on_farm_id", using: :btree
  add_index "lesson_date_times", ["instructor_id"], name: "index_lesson_date_times_on_instructor_id", using: :btree
  add_index "lesson_date_times", ["lesson_date_time_series_id"], name: "index_lesson_date_times_on_lesson_date_time_series_id", using: :btree
  add_index "lesson_date_times", ["location_id"], name: "index_lesson_date_times_on_location_id", using: :btree
  add_index "lesson_date_times", ["section_id"], name: "index_lesson_date_times_on_section_id", using: :btree

  create_table "lesson_people", force: :cascade do |t|
    t.integer  "student_id",               limit: 4
    t.integer  "horse_id",                 limit: 4
    t.integer  "item_id",                  limit: 4
    t.integer  "lesson_date_time_id",      limit: 4
    t.integer  "paid",                     limit: 4
    t.integer  "enrollment_status_id",     limit: 4
    t.string   "payment_image_file",       limit: 255
    t.text     "enrollment_notes",         limit: 65535
    t.datetime "date_enrolled"
    t.integer  "makeup_lesson",            limit: 4
    t.integer  "notification_level_id",    limit: 4
    t.text     "instructor_notes_private", limit: 65535
    t.text     "instructor_notes_public",  limit: 65535
    t.integer  "farm_id",                  limit: 4
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
  end

  add_index "lesson_people", ["enrollment_status_id"], name: "index_lesson_people_on_enrollment_status_id", using: :btree
  add_index "lesson_people", ["horse_id"], name: "index_lesson_people_on_horse_id", using: :btree
  add_index "lesson_people", ["item_id"], name: "index_lesson_people_on_item_id", using: :btree
  add_index "lesson_people", ["lesson_date_time_id"], name: "index_lesson_people_on_lesson_date_time_id", using: :btree
  add_index "lesson_people", ["student_id"], name: "index_lesson_people_on_student_id", using: :btree

  create_table "lesson_statuses", force: :cascade do |t|
    t.string   "lesson_status_name", limit: 255
    t.text     "lesson_status_desc", limit: 65535
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  create_table "locations", force: :cascade do |t|
    t.string   "location_name", limit: 255
    t.integer  "farm_id",       limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "locations", ["farm_id"], name: "index_locations_on_farm_id", using: :btree

  create_table "notifications", force: :cascade do |t|
    t.integer  "farm_id",                  limit: 4
    t.string   "notification_name",        limit: 255
    t.text     "notification_description", limit: 65535
    t.boolean  "active",                   limit: 1
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
  end

  add_index "notifications", ["farm_id"], name: "index_notifications_on_farm_id", using: :btree

  create_table "payrolls", force: :cascade do |t|
    t.integer  "instructor_id", limit: 4
    t.float    "hours",         limit: 24
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "payrolls", ["instructor_id"], name: "index_payrolls_on_instructor_id", using: :btree

  create_table "people", force: :cascade do |t|
    t.string   "person_name",     limit: 255
    t.string   "street_address1", limit: 255
    t.string   "street_address2", limit: 255
    t.string   "city",            limit: 255
    t.string   "state_province",  limit: 255
    t.string   "country",         limit: 255
    t.integer  "farm_id",         limit: 4
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  add_index "people", ["farm_id"], name: "index_people_on_farm_id", using: :btree

  create_table "product_programs", force: :cascade do |t|
    t.integer  "product_id", limit: 4
    t.integer  "program_id", limit: 4
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "product_programs", ["product_id"], name: "index_product_programs_on_product_id", using: :btree
  add_index "product_programs", ["program_id"], name: "index_product_programs_on_program_id", using: :btree

  create_table "products", force: :cascade do |t|
    t.string   "product_name",  limit: 255
    t.text     "product_desc",  limit: 65535
    t.integer  "product_price", limit: 4
    t.integer  "product_count", limit: 4
    t.integer  "renew_month",   limit: 4
    t.integer  "renew_week",    limit: 4
    t.integer  "farm_id",       limit: 4
    t.boolean  "active",        limit: 1
    t.string   "type",          limit: 255
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  add_index "products", ["farm_id"], name: "index_products_on_farm_id", using: :btree

  create_table "program_types", force: :cascade do |t|
    t.string   "program_type_name", limit: 255
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  create_table "programs", force: :cascade do |t|
    t.string   "program_name",          limit: 255
    t.text     "program_desc",          limit: 65535
    t.integer  "program_type_id",       limit: 4
    t.integer  "reporting_category_id", limit: 4
    t.integer  "duration",              limit: 4
    t.integer  "default_product_id",    limit: 4
    t.integer  "default_instructor_id", limit: 4
    t.integer  "farm_id",               limit: 4
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "programs", ["farm_id"], name: "index_programs_on_farm_id", using: :btree
  add_index "programs", ["program_type_id"], name: "index_programs_on_program_type_id", using: :btree

  create_table "reporting_categories", force: :cascade do |t|
    t.string   "reporting_category_name", limit: 255
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "section_horses", force: :cascade do |t|
    t.integer  "section_id", limit: 4
    t.integer  "horse_id",   limit: 4
    t.text     "notes",      limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "section_horses", ["horse_id"], name: "index_section_horses_on_horse_id", using: :btree
  add_index "section_horses", ["section_id"], name: "index_section_horses_on_section_id", using: :btree

  create_table "section_students", force: :cascade do |t|
    t.integer  "section_id", limit: 4
    t.integer  "student_id", limit: 4
    t.integer  "item_id",    limit: 4
    t.text     "notes",      limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "section_students", ["item_id"], name: "index_section_students_on_item_id", using: :btree
  add_index "section_students", ["section_id"], name: "index_section_students_on_section_id", using: :btree
  add_index "section_students", ["student_id"], name: "index_section_students_on_student_id", using: :btree

  create_table "sections", force: :cascade do |t|
    t.string   "section_name",          limit: 255
    t.string   "location",              limit: 255
    t.datetime "startdate"
    t.integer  "day_of_week",           limit: 4
    t.time     "starttime"
    t.integer  "duration",              limit: 4
    t.time     "endtime"
    t.string   "repeat_type",           limit: 255
    t.integer  "repeat_number",         limit: 4
    t.datetime "enddate"
    t.integer  "instructor_id",         limit: 4
    t.integer  "default_product_id",    limit: 4
    t.integer  "program_id",            limit: 4
    t.boolean  "is_section_enrollment", limit: 1
    t.integer  "max_enrollment",        limit: 4
    t.integer  "current_enrollment",    limit: 4
    t.integer  "farm_id",               limit: 4
    t.string   "stringnum",             limit: 255
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
  end

  add_index "sections", ["farm_id"], name: "index_sections_on_farm_id", using: :btree
  add_index "sections", ["instructor_id"], name: "index_sections_on_instructor_id", using: :btree
  add_index "sections", ["program_id"], name: "index_sections_on_program_id", using: :btree

  create_table "students", force: :cascade do |t|
    t.integer  "person_id",    limit: 4
    t.string   "student_name", limit: 255
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.integer  "user_id",      limit: 4
  end

  add_index "students", ["person_id"], name: "index_students_on_person_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.integer  "person_id",              limit: 4
    t.string   "username",               limit: 255
    t.datetime "join_date"
    t.integer  "farm_id",                limit: 4
    t.integer  "user_type",              limit: 4
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
