# ---------------- about

# from pymongo import MongoClient
# from app.core.config import settings
# from app.core.config import settings
# import redis.asyncio as redis


# client = MongoClient(settings.mongodb_uri)
# db = client.get_database("about_the_dev")

# coll = db['about']

# doc = {
#     "_id": "about_info",
#     "name": "Lemuel Torrefiel",
#     "title": "Data Analyst/Data Engineer/Aspiring Full Stack Dev",
#     "bio": "I am a passionate full stack developer with experience in building modern web applications using React, FastAPI, and MongoDB.",
#     "social_links": {
#         "github": "https://github.com/lalala0095",
#         "linkedin": "https://www.linkedin.com/in/lemuel-torrefiel/",
#         "credly": "https://www.credly.com/users/lemuel-torrefiel",
#         "portfolio_page": "https://expensechatbotcontainer-b7eka5fkg8aqc2hp.southeastasia-01.azurewebsites.net/portfolio"
#     },
#     "email": "torrefiellemuel@gmail.com",
#     "phone": "+63-968-7315190",
#     "address": "Bulacan, Philippines"
# }

# result = coll.update_one({"_id": doc['_id']}, {"$set": doc})
# print(result.modified_count)

# ---------------- skills

# from pymongo import MongoClient
# from app.core.config import settings
# import redis.asyncio as redis


# client = MongoClient(settings.mongodb_uri)
# db = client.get_database("about_the_dev")

# coll = db['skills']

# doc = [
#     {
#         "category": "Frontend",
#         "skills": [
#             { "name": "React", "level": "Beginner", "value": 60 },
#             { "name": "JavaScript", "level": "Beginner", "value": 60 },
#             { "name": "HTML/CSS", "level": "Beginner", "value": 60 }
#         ]
#     },
#     {
#         "category": "Backend",
#         "skills": [
#             { "name": "FastAPI", "level": "Intermediate", "value": 70 },
#             { "name": "Flask", "level": "Intermediate", "value": 70 },
#             { "name": "Nginx for Reverse Proxy", "level": "Beginner", "value": 60 },
#         ]
#     },
#     {
#         "category": "Full Stack",
#         "skills": [
#             { "name": "Google AppSheet", "level": "Advanced", "value": 85 }
#         ]
#     },    {
#         "category": "Database",
#         "skills": [
#             { "name": "MongoDB", "level": "Expert", "value": 100 },
#             { "name": "Microsoft SQL Server", "level": "Advanced", "value": 85 },
#             { "name": "PostgreSQL", "level": "Intermediate", "value": 70 },
#             { "name": "MySQL", "level": "Intermediate", "value": 70 },
#             { "name": "Redis", "level": "Intermediate", "value": 70 }
#         ]
#     },
#     {
#         "category": "Cloud Platforms",
#         "skills": [
#             { "name": "Azure Web Apps", "level": "Intermediate", "value": 70 },
#             { "name": "AWS EC2 Virtual Machines", "level": "Intermediate", "value": 70 },
#         ]
#     },
#     {
#         "category": "Data Analytics",
#         "skills": [
#             { "name": "Power BI", "level": "Expert", "value": 100 },
#             { "name": "SQL", "level": "Expert", "value": 100 },
#             { "name": "Spreadsheets", "level": "Expert", "value": 100 },
#             { "name": "Python", "level": "Expert", "value": 100 },
#             { "name": "R", "level": "Expert", "value": 100 },
#             { "name": "Looker Studio", "level": "Advanced", "value": 85 },
#         ]
#     },
#     {
#         "category": "Data Engineering",
#         "skills": [
#             { "name": "API", "level": "Expert", "value": 100 },
#             { "name": "Workflows using Task Scheduler", "level": "Expert", "value": 100 },
#             { "name": "Github Actions", "level": "Expert", "value": 100 },
#             { "name": "Microsoft Fabric Data Factory", "level": "Advanced", "value": 85 },
#             { "name": "Virtual Machines Workflow", "level": "Expert", "value": 100 },
#         ]
#     },
# ]

# for i in doc:
#     result = coll.update_one({"category": i['category']}, {"$set": i})
#     print(result.modified_count)

# ---------------- projects

# from pymongo import MongoClient
# from app.core.config import settings
# import redis.asyncio as redis


# client = MongoClient(settings.mongodb_uri)
# db = client.get_database("about_the_dev")

# coll = db['projects']

# doc = [
#     {
#         "title": "AdvPOS App FastAPI Version",
#         "description": "An ongoing project that aims to provide a functional web app to analyze user's Cash Flows, Expenses with user authentication.",
#         "tech": ["React", "FastAPI", "MongoDB", "AWS EC2", "Redis"],
#         "frontend_github_link": "https://github.com/lalala0095/advposreact/tree/react",
#         "backend_github_link": "https://github.com/lalala0095/advposreact/tree/master",
#         "url": "https://advposapp.com/"
#     },
#     {
#         "title": "AdvPOS App Flask Version",
#         "description": "This is the first version of the AdvPOS App FastAPI Version. This has more data entries like Orders, Products, Finance Planning and Feedbacks.",
#         "tech": ["HTML/CSS", "Flask", "MongoDB", "Azure Web Apps"],
#         "fullstack_github_link": "https://github.com/lalala0095/expensechatbotazure",
#         "url": "https://advpos-hxa6adhwfwdbd2d9.southeastasia-01.azurewebsites.net"
#     },
#     {
#         "title": "Expense Chat Bot App",
#         "description": "This is my the first project I did to study Python web development. This web app aims to have a chat bot version of an Expense tracker.",
#         "tech": ["HTML/CSS", "Flask", "Google Sheets", "Azure Web Apps"],
#         "fullstack_github_link": "https://github.com/lalala0095/expensechatbotazure",
#         "url": "https://expensechatbotcontainer-b7eka5fkg8aqc2hp.southeastasia-01.azurewebsites.net/"
#     },
# ]


# result = coll.insert_many(doc)
# print(result.inserted_ids)

# ---------------- skills

# from pymongo import MongoClient
# from app.core.config import settings
# import redis.asyncio as redis


# client = MongoClient(settings.mongodb_uri)
# db = client.get_database("about_the_dev")

# coll = db['experience']

# doc = [
#     {
#         "company": "Christina James Team",
#         "position": "Data Analyst/AppSheet Developer",
#         "duration": "May 2023 - Dec 2024",
#         "description": "Developed and maintained an AppSheet web app for Real Estate CRM + Reporting platform."
#     },
#     {
#         "company": "Cloudstaff",
#         "position": "Data Analyst and Engineer",
#         "duration": "Aug 2024 - Present",
#         "description": "Assist Real Estate company of Power BI Reports, Python ETL development to NoSQL and SQL databases."
#     },
#     {
#         "company": "TaskUs",
#         "position": "Data Visualization Analyst",
#         "duration": "Aug 2022 - Aug 2024",
#         "description": "Assist Operations department on implementing and ingesting new KPIs to Redshift database. Daily support of Campaigns’ reports in Power BI, Google Looker studio with ad hoc reports in Excel and Google Sheets."
#     },
#     {
#         "company": "Manila Electric Company (Meralco)",
#         "position": "Project Based Data Analyst",
#         "duration": "Nov 2020 - Aug 2022",
#         "description": "Maintain accuracy of meter data from the database versus the field data. Supervise digitizers’ concerns regarding data correction."
#     }
# ]


# for i in doc:
#     result = coll.update_one({"company": i['company']}, {"$set": i}, upsert=True)
#     print(result.modified_count)


# ---------------- combine about_the_dev

from pymongo import MongoClient
from app.core.config import settings
from app.core.config import settings
import redis.asyncio as redis


client = MongoClient(settings.mongodb_uri)
db = client.get_database("about_the_dev")

# coll = db['about']
# about = list(coll.find())

colls = db.list_collection_names()

coll = db['combined_about']
coll.insert_one({"_id": "combined_about"})

for i in colls:
    globals()[i] = list(db[i].find())
    to_add = {
        "_id": "combined_about",
        i: globals()[i]
    }
    coll.update_one({"_id": "combined_about"}, {"$set": to_add})
         

