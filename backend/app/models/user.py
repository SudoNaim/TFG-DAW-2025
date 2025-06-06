from sqlalchemy import Column, Integer, String
from app.config import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column("password_hash", String(255), nullable=False)
    bio = Column(String(500))
    friend_code = Column(String(20), unique=True)