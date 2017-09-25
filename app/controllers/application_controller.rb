class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  
  class InvalidTokenError < StandardError; end

    def validate_token
      begin
        authorization = request.headers['Authorization']
        raise InvalidTokenError if authorization.nil?

        token = request.headers['Authorization'].split(' ').last
        decoded_token = AuthToken.valid?(token)

        raise InvalidTokenError if Rails.application.secrets.auth0_client_id != decoded_token[0]["aud"]

        @user = decoded_token
      rescue JWT::DecodeError, InvalidTokenError
        render :json => { :error => "Unauthorized: Invalid token." }, status: :unauthorized
      end
    end
end
