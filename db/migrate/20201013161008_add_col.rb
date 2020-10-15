class AddCol < ActiveRecord::Migration[6.0]
  def change
    add_column :bots, :user_id, :int
  end
end
