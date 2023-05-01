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