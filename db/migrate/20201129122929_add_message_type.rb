class AddMessageType < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :message_type, :string
  end
end
