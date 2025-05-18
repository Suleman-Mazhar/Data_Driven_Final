from flask import Blueprint, request, jsonify

critical_items_bp = Blueprint('critical_items', __name__)

@critical_items_bp.route('/', methods=['GET'])
def get_critical_items():
    return jsonify({"message": "Get all critical items endpoint"})