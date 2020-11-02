class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.text :text_message
      t.string :node_type
      t.integer :node_id
      t.integer :bot_id
      t.timestamps
    end
  end
end
