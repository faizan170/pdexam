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
from src.database.Configs import get_questions
import os
from src.database.Reports import create_report as add_new_report, get_all_reports_for_user, delete_report_by_id, get_single_report
from config import app, s3Manager
from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token, verify_jwt_in_request
from flask_jwt_extended import get_jwt_identity, decode_token
from flask_jwt_extended import jwt_required
from src.utils.audio_utils import mp3_to_spectogram
from src.utils.create_report import create_report
from config import socket_app
import shutil
import jwt
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
    #@jwt_required()
    def post(self):
        #identity = get_jwt_identity()
        identity = ""
        pin_id = None
        token = request.headers.get("Authorization")
        if token is not None:
            token = token.split(" ")[1]
            print(token)
            identity = decode_token(token).get("sub")
        elif request.form.get("pin_id") not in ["null", None, ""]:
            identity = request.form.get("pin_id")
            pin_id = request.form.get("pin_id")
        
        if identity == "":
            return jsonify("Unauthorized User", 401)
        
        if 1==1:
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
            audio_files = []

            all_spectograms = []
            exam_ids = get_questions().get("test_data", [])
            
            for ex_id, row in enumerate(exam_ids):
                spectograms = {"left" : "", "right" : ""}
                audio_file_s = {"left" : "", "right" : ""}
                for key in ['right', 'left']:
                    file_id = f"{row['id']}-{key}"
                    if file_id in all_files:
                        
                        spect, audio_path = mp3_to_spectogram(all_files[file_id], file_id)
                        spectograms[key] = spect
                        
                        audio_file_s[key] = audio_path

                audio_files.append(audio_file_s)
                    
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

            
            send_socket_resp("Storing Data")

            final_audio_data = []
            report_id = os.path.basename(resp).split(".")[0]
            for single_audio_pair in audio_files:
                single_final_audio_data = {'left' : "", 'right' : ""}
                for audio_key, audio_path in single_audio_pair.items():
                    if audio_path != "":
                        single_final_audio_data[audio_key] = s3Manager.upload_file(audio_path, f"audio/{identity}/{report_id}/{os.path.basename(audio_path)}")
                        os.remove(audio_path)
                final_audio_data.append(single_final_audio_data)

            add_new_report({
                'test_performance' : test_performance.get(form_data.get("assist", ""), ""), 
                'medication_status' : medication_status.get(form_data.get("medication", ""), ""), 
                "rating_of_symptoms" : form_data.get("symptoms", ""),
                'filename' : os.path.basename(resp),
                'audio' : final_audio_data,
                'url' : public_url,
                'pin_id' : pin_id,
                'user_id' : ObjectId(identity) if pin_id == None else None
            })


            return make_response(jsonify({
                "status" : "success",
                "url" : public_url
            }), 200)
        #except Exception as ex:
        #    return make_response(str(ex), 400)
        
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
            for report in get_all_reports_for_user(ObjectId(identity)):
                report['_id'] = str(report['_id'])
                report['user_id'] = str(report['user_id'])

                reports.append(report)


            return make_response(jsonify(reports), 200)
        except Exception as ex:
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



class PDExamConfigs(Resource):
    def get(self):
        doc = get_questions()

        return doc