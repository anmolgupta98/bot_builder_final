class AddTransferMessageSwitchToNodesTable < ActiveRecord::Migration[6.0]
  def change
    add_column :nodes, :transfer_message_toggle_switch, :boolean
  end
end
