from flask import Flask
import os
from flask_cors import CORS
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_restful import Api
from src.s3Manager import S3Manager
from flask_socketio import SocketIO
from dotenv import load_dotenv

load_dotenv()

#app = Flask(__name__, static_folder='build')
app = Flask(__name__)
cors = CORS(app)
api = Api(app)

socket_app = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

s3Manager = S3Manager()

app.secret_key = os.environ.get('SECRET_KEY')

app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)



# intialize jwt manager
jwt = JWTManager(app)

app.app_context().push()

