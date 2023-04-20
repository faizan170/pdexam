from config import api
from views.User import (
    UserData, TestData
)
from views.PDExam import PDExam

api.add_resource(UserData, '/api/v1/user')
api.add_resource(TestData, '/api/v1/test')
api.add_resource(PDExam, '/api/v1/pdexam')


