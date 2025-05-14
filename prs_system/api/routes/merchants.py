# api/routes/merchants.py

from flask import Blueprint, request, jsonify

# This line must be exactly as shown:
merchants_bp = Blueprint('merchants', __name__)

@merchants_bp.route('/', methods=['GET'])
def get_merchants():
    return jsonify({"message": "Get merchants endpoint"})

@merchants_bp.route('/<merchant_id>', methods=['GET'])
def get_merchant(merchant_id):
    return jsonify({"message": f"Get merchant {merchant_id} endpoint"})

@merchants_bp.route('/', methods=['POST'])
def create_merchant():
    return jsonify({"message": "Create merchant endpoint"})