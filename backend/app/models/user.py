from sqlalchemy import Column, Integer, String
from app.config import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column("password_hash", String(255), nullable=False)
#   fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
#   perfil_publico = Column(Boolean, default=False)xº