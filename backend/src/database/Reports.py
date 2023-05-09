from src.database.db_model import db
from bson.objectid import ObjectId

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4

reports_col = db.reports


def create_report(report):
    """ Create a new report 
    
    Args:
        report (dict): report dict
    Returns:
        user (obj): report id
    """
    try:
        report['created_at'] = datetime.now()
        
        # create user object
        result = reports_col.insert_one(report)
        return result.inserted_id

    except Exception as err:
        print(err)
        return False
    
def get_all_reports_for_user(user_id):
    return reports_col.find({"user_id" : user_id})

def delete_report_by_id(report_id):
    report = reports_col.find_one({"_id" : ObjectId(report_id)})

    result = reports_col.delete_one({"_id" : ObjectId(report_id)})

    return result.deleted_count, report


def get_single_report(report_id):
    report = reports_col.find_one({"_id" : ObjectId(report_id)})
    return report

def get_all_reports():
    # perform a join between the collections using the aggregate function
    pipeline = [
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$project": {
                "_id": 1,
                "user_id": 1,
                "full_name": "$user.full_name",
                "email": "$user.email",
                "url": 1,
                'filename' : 1,
                'created_at' : 1
            }
        }
    ]

    # execute the pipeline and get all reports with corresponding user's full name and email
    all_reports_with_user_data = list(reports_col.aggregate(pipeline))

    pipeline = [
        {
            "$lookup": {
                "from": "pins",
                "localField": "pin_id",
                "foreignField": "pin_id",
                "as": "pin_info"
            }
        },
        {
            "$unwind": "$pin_info"
        },
        {
            "$project": {
                "_id": 1,
                "user_id": None,
                "full_name": "$pin_info.name",
                "url": 1,
                'filename' : 1,
                'created_at' : 1
            }
        }
    ]

    # execute the pipeline and get all reports with corresponding user's full name and email
    all_reports_with_pin_data = list(reports_col.aggregate(pipeline))


    return all_reports_with_user_data + all_reports_with_pin_data