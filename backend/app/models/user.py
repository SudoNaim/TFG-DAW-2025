from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship                # ← Import necesario
from app.config import Base
from app.models.friendship import amigos_table 

# modelo de la tabla "Usuarios", se encarga de crear la tabla a través de SQLAlchemy y de delimitar qué tipos de datos son necesarios
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    bio = Column(Text)
    friend_code = Column(String(100), unique=True, nullable=False)

# relación de amistad muchos-a-muchos consigo mismo, ya que se creará una tabla nueva a partir de esta relación
# explicitamos la conexión entre el id de usuario e id de amigo para estructurar la relación
    friends = relationship(
        "User",
        secondary=amigos_table,
        primaryjoin=id == amigos_table.c.user_id,
        secondaryjoin=id == amigos_table.c.friend_id,
        back_populates="friends"
    )

    # Esta es la relación de 1 a n que puede tener un usuario con respecto a las publicaciones que se pueden realizar dentro de la aplicación
    posts = relationship("Post", back_populates="autor")
