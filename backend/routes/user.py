from config import api
from views.User import (
    UserData, TestData
)

from views.Admin import (
    Admin, PinsAPI
)
from views.PDExam import PDExam, PDExamConfigs
from views.User import PinVerify

api.add_resource(UserData, '/api/v1/user')
api.add_resource(TestData, '/api/v1/test')
api.add_resource(PDExam, '/api/v1/pdexam')
api.add_resource(PDExamConfigs, '/api/v1/configs')
api.add_resource(Admin, '/api/v1/admin')
api.add_resource(PinsAPI, '/api/v1/pin')
api.add_resource(PinVerify, '/api/v1/pin/verify')



