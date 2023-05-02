from src.database.db_model import db

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4

users_col = db.users

class User():
    def __init__(self, user_data: dict) -> None:
        self.id = str(user_data.get("_id"))
        self.full_name = user_data['full_name']
        self.email = user_data.get("email")
        self.username = user_data.get("username")
        self.status = user_data.get("status")
        self.created_at = user_data.get("created_at")
        self.role = user_data.get("role", "user")


def create_user(email, password, full_name, status="pending"):
    """ Create a new user 
    
    Args:
        email (str): user email
        password (str): user password
        full_name (str): user full name
        status (str): user status (pending, active, inactive)
    Returns:
        user (obj): user object
    """
    try:
        # create username from email
        username = "{}-{}".format(email.split("@")[0], str(datetime.now().microsecond))
        
        # create user object
        result = users_col.insert_one({
            'full_name' : full_name, "email" : email, "password" : generate_password_hash(password),
            "status": status, "username" : username,
            "created_at" : datetime.now(),
            "updated_at" : datetime.now(),
            "role" : "user"
        })
        return result.inserted_id

    except Exception as err:
        print(err)
        return False


def check_email_exists(email):
    """
    Check if email already exists
    Args:
        email (str): user email
    Returns:
        Boolean: User if exists, None if not
    """
    # check if user already exists
    user = users_col.find_one({"email": email})
    return User(user) if user else False


def check_user_existance(email, password):
    """
    Check if user exists using email and password
    Args:
        email (str): user email
        password (str): user password
    Returns:
        user (obj): user object if exists, None if not
    """
    try:
        user = users_col.find_one({"email": email})
        if user and check_password_hash(user['password'], password):
            return User(user)
        return None
    except Exception as err:
        return None
    


def get_all_users():
    pipeline = [
        {
            "$lookup": {
                "from": "reports",
                "localField": "_id",
                "foreignField": "user_id",
                "as": "reports"
            }
        },
        {
            "$project": {
                "_id": 1,
                "full_name": 1,
                "email": 1,
                "status": 1,
                "created_at": 1,
                "report_count": {"$size": "$reports"}
            }
        }
    ]

    # execute the pipeline and get all users with report count
    all_users_with_report_count = list(users_col.aggregate(pipeline))
    return all_users_with_report_count