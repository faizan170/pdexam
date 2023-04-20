from config import api
from views.Authentication import (
    Login, Register, RefreshToken
)

api.add_resource(Login, '/api/v1/login')
api.add_resource(Register, '/api/v1/register')
api.add_resource(RefreshToken, '/api/v1/refresh-token')
