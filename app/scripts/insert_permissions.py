from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from bson import ObjectId

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URL)
coll = client['advpos-react']['permissions']

coll.delete_many({})

with open('app/static/jsons/permissions.json', 'r') as file:
    json_permissions = json.load(file)

new_docs = []
for i in json_permissions:
    new_dict = i.copy()
    new_dict["new_id"] = ObjectId(new_dict["_id"]["$oid"])
    del new_dict["_id"]["$oid"]
    new_dict["_id"] = new_dict["new_id"] 
    del new_dict["new_id"]
    new_docs.append(new_dict)

# print(json_permissions)
coll.insert_many(new_docs)