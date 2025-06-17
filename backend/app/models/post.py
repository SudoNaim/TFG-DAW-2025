from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, DECIMAL
from sqlalchemy.orm import relationship
from app.config import Base

# modelo para representar la tabla de "Publicaciones", creándola a través de SQLAlchemy
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    imagen_url = Column(String(255), nullable=True)
    valoracion = Column(DECIMAL(3,1), nullable=False)
    categoria = Column(String(50), nullable=False)
    resena = Column(Text, nullable=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # también definimos la relación con el usuario, llamándola "Autor"
    autor = relationship("User", back_populates="posts")

