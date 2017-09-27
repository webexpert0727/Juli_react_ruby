class Api::V1::ApiController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :validate_token
  before_action :authenticate_user!
  respond_to :json

  def parse_date(date)
  	Date.strptime(date, "%m/%d/%Y").in_time_zone
  end

  def format_of_daterange(date1, date2)
  	formatedDate1 = date1.strftime("%b %d")
  	formatedDate2 = date2.strftime("%b %d")
  	year = date1.strftime("%Y")
  	return "#{formatedDate1} - #{formatedDate2}, #{year}"
  end
end