from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from bson import ObjectId

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URL)
coll = client['advpos-react']['roles']

coll.delete_many({})

with open('app/static/jsons/roles.json', 'r') as file:
    json_roles = json.load(file)

coll.insert_many(json_roles)