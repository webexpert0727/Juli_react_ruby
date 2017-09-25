class Api::V1::SectionsController < Api::V1::ApiController
  def index
    render status: 200, json: { sections: Section.all }
  end
end
