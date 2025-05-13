from flask import Blueprint, request, jsonify

purchases_bp = Blueprint('purchases', __name__)

@purchases_bp.route('/', methods=['GET'])
def get_purchases():
    return jsonify({"message": "Get purchases endpoint"})