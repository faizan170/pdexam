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
import os
from src.database.Reports import get_all_reports, delete_report_by_id, get_single_report
from src.database.Users import get_all_users
from src.database.Pins import get_all_pins, create_pin, get_all_pin_reports
from config import app, s3Manager
from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token, verify_jwt_in_request
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from src.utils.audio_utils import mp3_to_spectogram
from src.utils.create_report import create_report
from config import socket_app
import shutil
#from docx2pdf import convert
import time


# Refresh Token
class Admin(Resource):        
    @jwt_required()
    def get(self):
        """ 
        Get all reports
        ---
        swagger_from_file: static/swagger/reports/all.yml
        """
        try:
            identity = get_jwt_identity()
            report_id = request.args.get("report_id")
            if report_id:
                report_data = get_single_report(report_id)
                report_data['_id'] = str(report_data['_id'])
                report_data['user_id'] = str(report_data['user_id'])

                return make_response(jsonify(report_data), 200)



            reports = []
            for report in get_all_reports():
                report['_id'] = str(report['_id'])
                report['user_id'] = str(report['user_id'])

                reports.append(report)


            users = []
            for user in get_all_users():
                user['_id'] = str(user['_id'])
                users.append(user)

            pins = []
            for pin in get_all_pin_reports():
                pin['_id'] = str(pin['_id'])
                pins.append(pin)
            print(pins)

            return make_response(jsonify({
                'reports' : reports, "users": users, 'pins' : pins
            }), 200)
        except Exception as ex:
            print(ex)
            return make_response(str(ex), 400)
        

    @jwt_required()
    def delete(self):
        """ 
        Delete a report
        ---
        swagger_from_file: static/swagger/reports/delete.yml
        """
        try:
            identity = get_jwt_identity()
            print(request.get_json())
            report_id = request.get_json().get("report_id")

            status, report = delete_report_by_id(report_id)

            s3Manager.delete_file(f"reports/{identity}/" + report['filename'])
            #s3Manager.delete_folder(f"audio/{identity}/{report_id}")


            return make_response(jsonify({"status" : "success"}), 200)
        except Exception as ex:
            print(ex)
            return make_response(str(ex), 400)



class PinsAPI(Resource):
    def post(self):
        try:
            data = request.get_json()
            print(data)
            pin = create_pin(data.get("name", "Guest"))

            if type(pin) == dict:
                return make_response(jsonify(pin))
            return make_response("Error generating pin", 400)
        except Exception as ex:
            return make_response(str(ex), 500)    