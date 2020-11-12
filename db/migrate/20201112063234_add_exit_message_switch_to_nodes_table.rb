class AddExitMessageSwitchToNodesTable < ActiveRecord::Migration[6.0]
  def change
    add_column :nodes, :exit_message_toggle_switch, :boolean
  end
end
