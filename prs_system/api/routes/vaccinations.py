from flask import Blueprint, request, jsonify

vaccinations_bp = Blueprint('vaccinations', __name__)

@vaccinations_bp.route('/', methods=['GET'])
def get_vaccinations():
    return jsonify({"message": "Get vaccinations endpoint"})