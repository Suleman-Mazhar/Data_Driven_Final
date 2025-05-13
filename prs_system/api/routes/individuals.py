from flask import Blueprint, request, jsonify

individuals_bp = Blueprint('individuals', __name__)

@individuals_bp.route('/', methods=['GET'])
def get_individuals():
    return jsonify({"message": "Get all individuals endpoint"})

@individuals_bp.route('/<prs_id>', methods=['GET'])
def get_individual(prs_id):
    return jsonify({"message": f"Get individual {prs_id} endpoint"})