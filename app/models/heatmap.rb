class Heatmap < ActiveRecord::Base
	validates :timestamp, uniqueness: true
end
