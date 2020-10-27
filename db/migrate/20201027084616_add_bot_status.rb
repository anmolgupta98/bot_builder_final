class AddBotStatus < ActiveRecord::Migration[6.0]
  def change
    add_column :bots, :status, :string
  end
end
