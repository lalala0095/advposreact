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

with open('app/static/jsons/roles_with_ids.json', 'r') as file:
    json_roles = json.load(file)

new_docs = []
for i in json_roles:
    new_dict = i.copy()
    new_dict["new_id"] = ObjectId(new_dict["_id"]["$oid"])
    del new_dict["_id"]
    new_dict["_id"] = new_dict["new_id"] 
    del new_dict["new_id"]
    new_permissions = []
    for x in i['permissions']:
        new_dict_perm = x.copy()
        new_dict_perm["new_id"] = ObjectId(new_dict_perm["_id"]["$oid"])
        del new_dict_perm["_id"]
        new_dict_perm["_id"] = new_dict_perm["new_id"] 
        del new_dict_perm["new_id"]
        new_permissions.append(new_dict_perm)
    del new_dict["permissions"]
    new_dict.update({"permissions": new_permissions})
    new_docs.append(new_dict)

coll.insert_many(new_docs)