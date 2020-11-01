class CreateTriggerphrases < ActiveRecord::Migration[6.0]
  def change
    create_table :triggerphrases do |t|
      t.string :trigger
      t.integer  :bot_id
      t.timestamps
    end
  end
end
