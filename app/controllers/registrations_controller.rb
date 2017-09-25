class RegistrationsController < Devise::RegistrationsController  
  respond_to :json

  private

  def sign_up_params
    params.require(:user).permit(:user_type, :email, :username, :password, :password_confirmation)
  end
end