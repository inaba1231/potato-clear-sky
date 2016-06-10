class CreateHeatmaps < ActiveRecord::Migration
  def change
    create_table :heatmaps do |t|
      t.string :timestamp
      t.string :hue

      t.timestamps null: false
    end
  end
end
