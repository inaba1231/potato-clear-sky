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
		
		
	end


end
