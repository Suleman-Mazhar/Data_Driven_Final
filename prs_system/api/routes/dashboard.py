from flask import Blueprint, request, jsonify

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    return jsonify({"message": "Get dashboard stats endpoint"})