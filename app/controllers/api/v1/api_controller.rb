class Api::V1::ApiController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :validate_token
  before_action :authenticate_user!
  respond_to :json
end