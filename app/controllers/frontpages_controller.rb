require 'nokogiri'
require 'rmagick'
require 'open-uri'
class FrontpagesController < ApplicationController
	
	def new

	end
	def index
	end

	def show

	end

	def create
	end

	def main
		@input = params[:input]
		flash[:notice] = "#{@input}"
		



	end

	def edit
	end

	def destroy
	end

	def update
	end

	def about
	end

	def latest

		weather_link = 'http://www.weather.gov.sg/weather-rain-area-50km/'
		html = Nokogiri::HTML(open(weather_link))
		time_text = html.css('ul.list-unstyled').css('li').map { |e|  e['id']}.compact

		@latestTime = time_text[-1]
		time = Time.parse(@latestTime)
  		year = time.year
  		month = time.strftime("%m")
  		day = time.strftime("%d")
  		hour = time.strftime("%H")
  		min = time.strftime("%M")
  		image_path = "http://www.weather.gov.sg/files/rainarea/50km/v2/dpsri_70km_#{year}#{month}#{day}#{hour}#{min}0000dBR.dpsri.png"
  		@heatmap_name = image_path.split("v2/")[1]

  		open(image_path) { |f|
  			File.open("./app/assets/images/temp.png", "wb") do |file|
  				file.puts f.read
  			end

  		}

  		heatmap ="./app/assets/images/temp.png"

  		map_heatmap = Magick::Image.read(heatmap).first
  		scale_heatmap = map_heatmap.adaptive_resize(853, 479)

  		base = Magick::Image.read("./app/assets/images/base-853.png").first
  		base.composite(scale_heatmap, 0, 0, Magick::OverCompositeOp).write("./app/assets/images/overlay.png")

		
		
	end

	def contact
	end


end
