class Api::V1::HorsesController < Api::V1::ApiController

  def index
    render status: 200, json: { horses: Horse.all }
  end

  def create
    horse = Horse.new(horse_params)
    if horse.save
      render status: 200, json: { horse: horse,
                                  notice: 'Horse was successfully created.' }
    else
      render status: 400, json: { error: horse.errors.full_messages }
    end
  end

  private

  def horse_params
    params.require(:hourse).permit(:horse_name)
  end
end
