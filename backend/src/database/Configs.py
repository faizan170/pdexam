from src.database.db_model import db
from bson.objectid import ObjectId

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from random import choice
import string
pins_col = db.configs

def get_questions():
    """ 
    Returns questions
    """
    try:

        doc = pins_col.find_one({"type" : "config"})
        
        ids_with_data = {}
        for row in doc['tests']:
            ids_with_data[row['id']] = {'left' : None, 'right' : None}

        questions = []
        for q in doc['questions']:
            if q['type'] == 'range':
                q['marks'] = [{'value' : i, 'label' : str(i)} for i in range(q['min'], q['max'] + 1)]
                
            questions.append(q)

        del doc["_id"]
        return {
            "test_data" : doc['tests'], 'data' : ids_with_data, "questions" : questions, "tutorial" : doc.get("tutorial")
        }

    except Exception as err:
        return None