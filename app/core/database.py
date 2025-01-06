from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import redis.asyncio as redis


client = AsyncIOMotorClient(settings.mongodb_uri)
db = client.get_database("advpos-react")

redis_client = redis.from_url(f"{settings.redis_url}", decode_responses=True)
