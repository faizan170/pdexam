# Authentication Routes for Login, Signup, and Logout
from datetime import datetime, timedelta
from flask_restful import Resource
from flask import request, jsonify, make_response
from src.utils.auth import validate_password
from src.database.Users import (
    users_col
)
from bson.objectid import ObjectId

from src.utils.logger import error_logger, info_logger

from config import app
from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token, verify_jwt_in_request
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required



# Refresh Token
class UserData(Resource):
    @jwt_required()
    def get(self):
        """ 
        Refresh Token API
        ---
        swagger_from_file: static/swagger/user/data.yml
        """
        identity = get_jwt_identity()
        print(identity)
        
        user = users_col.find_one(ObjectId(identity))

        return make_response(jsonify({
            "status" : "success",
            "data" : {
                "full_name" : user['full_name'],
                "username" : user['username'],
                "id" : identity,
                "email" : user['email'],
                "created_at" : user['created_at'].strftime("%Y-%m-%d %H:%M:%S"),
                'role' : user['role']
            }
        }), 200)


class TestData(Resource):
    def get(self):

        print(request.headers)

        return "ok"