from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_uri: str
    secret_key: str
    redis_url: str
    s3_bucket: str
    s3_base_url: str

    class Config:
        env_file = ".env"  

# Create a settings instance
settings = Settings()
print(F"S3 BUCKET BASE URL: {settings.s3_base_url}")