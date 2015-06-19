class AddHourlyrateToWorker < ActiveRecord::Migration
  def change
    add_column :workers, :hourly_rate, :float

    Worker.reset_column_information

    #initialize existing workers' hourly rates to 0
    Worker.all.each do |t|
      t.update_attribute :hourly_rate, 0
    end

  end
end
