class Bot < ApplicationRecord
  belongs_to :user
  has_many :triggerphrases, dependent: :destroy
  has_many :nodes, dependent: :destroy
  has_many :reminders, dependent: :destroy
end    