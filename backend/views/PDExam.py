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

exam_ids = [  { "title": "Arm at rest", "id": "arm_at_rest", "type": "arm" },  
            { "title": "Outstretched Arm", "id": "outstretched_arm", "type": "arm" },  
            { "title": "Finger Tapping", "id": "finger_tapping", "type": "arm" },  
            { "title": "Hand Open-Close", "id": "hand_open_close", "type": "arm" },  
            { "title": "Elbow Flexion", "id": "elbow_flexion", "type": "arm" },  
            { "title": "Leg at Rest", "id": "leg_at_rest", "type": "leg" },  
            { "title": "Outstretched Leg", "id": "outstretched_leg", "type": "leg" },  
            { "title": "Toe Tapping", "id": "toe_tapping", "type": "leg" },  
            { "title": "Heel Tapping", "id": "heel_tapping", "type": "leg" },  
            { "title": "Knee Flexion", "id": "knee_flexion", "type": "leg" }]

test_performance = {"yes" : "With Assistance", "no" : "Without Assistance"}
medication_status = {
    "4 or 4+ hours" : "Off Med (No med/ 4 hours ago or more)",
    "none" : "Off Med (No med/ 4 hours ago or more)",
    "1-3 hours" : "On Med (within 1-3 hours of taking medications)"
}

os.makedirs("static/temp", exist_ok=True)


import subprocess

def generate_pdf(doc_path, path):

    subprocess.call(['soffice',
                 # '--headless',
                 '--convert-to',
                 'pdf',
                 '--outdir',
                 path,
                 doc_path])
    return doc_path

def send_socket_resp(resp):
    socket_app.emit('processResponse', {
            'data' : resp
         })

# Refresh Token
class PDExam(Resource):
    @jwt_required()
    def post(self):
        """ 
        Refresh Token API
        ---
        swagger_from_file: static/swagger/user/data.yml
        """
        
        identity = get_jwt_identity()
        try:
            st = time.time()
            form_data = dict(request.form)
            fileds_data = {
                'User Code' : identity, 
                'Date' : datetime.now().strftime("%d %B %Y"), 
                'Time' : datetime.now().strftime("%H:%M:%S"), 
                'Test Performace' : test_performance.get(form_data.get("assist", ""), ""), 
                'Medication Status' : medication_status.get(form_data.get("medication", ""), ""), 
                "Patient's rating of symptoms severity" : form_data.get("symptoms", "")
            }

            
            all_files = request.files

            all_spectograms = []
            for ex_id, row in enumerate(exam_ids):
                spectograms = {"left" : "", "right" : ""}
                for key in ['right', 'left']:
                    file_id = f"{row['id']}-{key}"
                    if file_id in all_files:
                        spectograms[key] = mp3_to_spectogram(all_files[file_id], file_id)
                    
                row['spectogram'] = spectograms
                all_spectograms.append(row)
                send_socket_resp(f"{round((ex_id / len(exam_ids)) * 100)}%")

            final_data = {
                'spectograms' : all_spectograms,
                "fields" : fileds_data
            }

            send_socket_resp("Creating report")

            resp = create_report(final_data)
            #convert(resp, "static/temp/report.pdf")
            #subprocess.run(['unoconv', '-f', 'pdf', resp])
            send_socket_resp("Creating PDF")
            os.system(f"lowriter --headless --convert-to pdf {resp}")
            pdf_path = resp.replace(".docx", ".pdf")
            if os.path.exists(os.path.basename(pdf_path)):
                shutil.move(os.path.basename(pdf_path), pdf_path)
                resp = pdf_path
            print(time.time() - st)

            public_url = s3Manager.upload_file(resp, f"reports/{identity}/" + os.path.basename(resp))

            #file = request.files['arm_at_rest-right']
            #file.save("test.mp3")

            return make_response(jsonify({
                "status" : "success",
                "url" : public_url
            }), 200)
        except Exception as ex:
            return make_response(str(ex), 400)