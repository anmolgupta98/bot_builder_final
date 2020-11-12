class AddTransferMessageToNodes < ActiveRecord::Migration[6.0]
  def change
    add_column :nodes, :transfer_message, :text
  end
end
