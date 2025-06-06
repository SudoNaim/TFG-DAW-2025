from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.config import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    imagen_url = Column(String(255), nullable=True)
    valoracion = Column(Integer, nullable=False)
    categoria = Column(String(50), nullable=False)
    resena = Column(String(500), nullable=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    autor = relationship("User", backref="posts")
