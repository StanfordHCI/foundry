class Task < ActiveRecord::Base
	belongs_to :flash_team
  has_and_belongs_to_many :members
  has_and_belongs_to_many :handoffs
  has_and_belongs_to_many :collaborations

  def get_data
    parsed_data = JSON.parse((self.data_json.presence || '{}'))
    parsed_data['_id'] = self.id
    parsed_data
  end

  after_destroy do
    PrivatePub.publish_to("/flash_team/#{self.flash_team.id}/event_deleted", self.id)
  end

  after_create do
    PrivatePub.publish_to("/flash_team/#{self.flash_team.id}/event_created", self.get_data)
  end
end
