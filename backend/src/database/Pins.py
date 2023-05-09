from src.database.db_model import db
from bson.objectid import ObjectId

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from random import choice
import string
pins_col = db.pins

eng_letters = [i for i in string.ascii_uppercase]
numbers = list(range(0, 10))

def get_random_pin():
    mstring = ''
    mstring += "".join([choice(eng_letters) for i in range(2)])
    mstring += "".join([str(choice(numbers)) for i in range(4)])
    return mstring


def create_pin(name):
    """ Create a new pin 
    
    Args:
        pin (dict): pin dict
    Returns:
        user (obj): pin id
    """
    try:

        pin = {
            'created_at' :  datetime.now(),
            'name' : name,
        }


        found = True
        for i in range(10):
            generated_pin = get_random_pin()
            if pins_col.find_one({"pin_id" : generated_pin}) == None:
                found = False
                break
        
        if found:
            return "Cannot generate pin"

        pin['pin_id'] = generated_pin
        
        # create user object
        result = pins_col.insert_one(pin)
        return {"pin" : generated_pin, "_id" : str(result.inserted_id)}

    except Exception as err:
        print(err)
        return False
    
def get_pin(pin_id):
    return pins_col.find_one({"pin_id" : pin_id})

def delete_pin_by_id(pin_id):
    pin = pins_col.find_one({"pin_id" : ObjectId(pin_id)})

    result = pins_col.delete_one({"pin_id" : ObjectId(pin_id)})

    return result.deleted_count, pin

def get_all_pins():
    return pins_col.find()

def get_single_pin(pin_id):
    pin = pins_col.find_one({"_id" : ObjectId(pin_id)})
    return pin

def get_all_pin_reports():
    # perform a join between the collections using the aggregate function
    reports = []
    for report in pins_col.aggregate([
        # Join with the reports collection and group by pin_id
        { '$lookup': {
            'from': 'reports',
            'localField': 'pin_id',
            'foreignField': 'pin_id',
            'as': 'reports'
            }
        },
        { '$unwind': { 'path': '$reports', 'preserveNullAndEmptyArrays': True } },
        { '$group': {
            '_id': '$_id',
            'pin_id': {'$first': '$pin_id'},
            'name': { '$first': '$name' },
            'created_at': {'$first': '$created_at'},
            'count': { '$sum': { '$cond': { 'if': { '$eq': [ '$reports.pin_id', '$pin_id' ] }, 'then': 1, 'else': 0 } } }
            }
        }
        ]):
        reports.append(report)
    return reports