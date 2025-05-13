from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify

def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            roles = claims.get("roles", [])
            
            if role not in roles:
                return jsonify({"message": "Access denied"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper