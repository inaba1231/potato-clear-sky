require 'test_helper'

class HeatmapTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
  	@heatmap = Heatmap.new(timestamp: "dpsri_xxkm_yyyymmddhhmm00000dBR.dpsri.png", hue: "[[0,2,3],[0]]")
  end

  test "timeStamp should be unique" do
  	duplicate_heatmap = @heatmap.dup
  	@heatmap.save
  	assert_not duplicate_heatmap.valid?
  end
end