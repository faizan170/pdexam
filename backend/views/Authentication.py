# Authentication Routes for Login, Signup, and Logout
from datetime import datetime, timedelta
from flask_restful import Resource
from flask import request, jsonify, make_response
from src.utils.auth import validate_signup_data, validate_login_data
from src.database.Users import (
    create_user, check_email_exists, check_user_existance,
    db
)
from src.utils.logger import error_logger, info_logger
from config import app
from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from src.utils.mail_utils import send_email
import os

def get_remote_addr():
    """ Get remote address
    Returns:
        str: remote address
    """
    if request.headers.getlist("X-Forwarded-For"):
        return request.headers.getlist("X-Forwarded-For")[0]
    else:
        return request.remote_addr

class Login(Resource):
    def post(self):
        """ 
        Login User API
        ---
        swagger_from_file: static/swagger/authentication/login.yml
        """

        data = request.get_json()
        useremail = data.get('email')
        password = data.get('password')

        # check if email and password are valid
        validation_resp = validate_login_data(useremail, password)
        if validation_resp != True:
            info_logger.error("Validation failed for {}".format(useremail))
            return make_response(jsonify({"error" : validation_resp}), 400)

        # validate user
        user = check_user_existance(useremail, password)

        if not user:
            info_logger.error("Verification Failed: User '{}' does not exist".format(useremail))
            return make_response(jsonify({"error" : "Invalid User credentials"}), 409)

        if user.status == 'pending':
            info_logger.error("Verification Failed: User '{}' is pending".format(useremail))
            return make_response(jsonify({"error" : "User is not verified"}), 409)

        # generate token
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        user_data = {
            'id': str(user.id),
            'accessToken': access_token,
            'refreshToken': refresh_token,
            "fullName" : user.full_name,
            "username" : user.username,
            "role" : user.role,
            "email" : user.email,
        }
        print(access_token)


        info_logger.info("User {} logged in".format(useremail))
        return make_response(jsonify(user_data), 200)


class Register(Resource):
    def post(self):
        """ 
        User Register API
        ---
        swagger_from_file: static/swagger/authentication/register.yml
        """
        data = request.get_json()
        print("data is:", data)

        # validate user (username, email, password) are required
        validation_resp = validate_signup_data(data)
        if validation_resp != True:
            print(validation_resp)
            return make_response(jsonify({"error" : validation_resp}), 400)

        # check if user email already exists
        if check_email_exists(data.get("email")):
            return make_response(jsonify({"error" : "Email already exists"}), 409)

        # create user
        resp = create_user(data['email'], data['password'], data['name'], 'activated')
        if not resp:
            return make_response(jsonify({"message": "User creation failed"}), 500)

        #body = f"<p>Hi {data.get('email')}. Please click on link to activate your account.<br /><a href='{os.getenv('BASE_FRONTEND_URL')}/verify-email?verification_key={resp}'>{os.getenv('BASE_FRONTEND_URL')}/verify-email?verification_key={resp}</a></p>"
        #r = send_email(data.get("email"), "Account activation", body)
        #print("Email", r)
        return make_response(jsonify({'message': 'User created successfully'}))

# Refresh Token
class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
        """ 
        Refresh Token API
        ---
        swagger_from_file: static/swagger/authentication/refresh_token.yml
        """
        identity = get_jwt_identity()
        
        access_token = create_access_token(identity=identity)

        return make_response(jsonify({"message": "Token refreshed", 'token' : access_token}), 200)