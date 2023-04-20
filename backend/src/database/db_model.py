import pymongo
import os

client = pymongo.MongoClient(os.environ.get("MONGODB_CONNECTION_STRING"))
db = client.test