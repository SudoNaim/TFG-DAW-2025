from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship                # ← Import necesario
from app.config import Base

class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    username      = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    bio           = Column(Text)
    friend_code   = Column(String(100))

    # Ahora sí puedes usar relationship:
    posts = relationship("Post", back_populates="autor")
