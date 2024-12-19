from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from bson import ObjectId
import pandas as pd

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URI")

roles = [
    {
        "role": "root",
        "permissions": [
            "General",
            "User Management",
            "Data Management",
            "Reports and Analytics",
            "System Management",
            "Inventory Management",
            "Billing and Payments",
            "Notification Management",
            "Admin-Only"
        ]
    },
    {
        "role": "admin",
        "permissions": [
            "General",
            "User Management",
            "Data Management",
            "Reports and Analytics",
            "System Management",
            "Inventory Management",
            "Billing and Payments",
            "Notification Management"
        ]
    },
    {
        "role": "user",
        "permissions": [
            "General",
            "Data Management",
            "Reports and Analytics",
            "Inventory Management",
            "Billing and Payments"
        ]
    },
    {
        "role": "viewer",
        "permissions": [
            "General",
            "Reports and Analytics"
        ]
    },
    {
        "role": "guest",
        "permissions": [
            "Guest or Public"
        ]
    }
]

client = MongoClient(MONGODB_URL)
coll = client['advpos-react']['permissions']

new_roles = []
for role in roles:
    permission_objects = []
    for index, x in enumerate(role['permissions']):
        permission_object = coll.find_one({"permission_category": x})
        permission_objects.append(permission_object)
    new_roles.append({
        "role": role['role'],
        "permissions": permission_objects
    })

coll = client['advpos-react']['roles']
coll.insert_many(new_roles)