from sqlalchemy import Table, Column, Integer, ForeignKey
from app.config import Base

# relación de N a M que define las amistades entre los usuarios de la aplicación
amigos_table = Table(
    "amigos",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("friend_id", Integer, ForeignKey("users.id"), primary_key=True),
)