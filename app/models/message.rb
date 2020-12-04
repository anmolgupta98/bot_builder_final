class Message < ApplicationRecord
    belongs_to :node
    has_one_attached :image
    has_rich_text :content
end    