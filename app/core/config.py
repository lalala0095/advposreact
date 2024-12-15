from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_uri: str
    secret_key: str
    redis_url: str

    class Config:
        env_file = ".env"  

# Create a settings instance
settings = Settings()
