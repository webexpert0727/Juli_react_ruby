class Api::V1::LocationsController < Api::V1::ApiController
  def index
    render status: 200, json: { locations: Location.all }
  end
end
