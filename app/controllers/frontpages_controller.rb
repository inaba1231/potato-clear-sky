class FrontpagesController < ApplicationController
	def index
	end

	def show

	end

	def create
	end

	def view
		input = params[:input]
	
		flash[:notice] = "#{input}"
		redirect_to :action => "view"


	end

	def edit
	end

	def destroy
	end

	def update
	end


end
