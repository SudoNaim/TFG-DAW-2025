# app/schemas/friend.py
from pydantic import BaseModel

class FriendAdd(BaseModel):
    friend_code: str
class FriendOut(BaseModel):
    idUsuario: int
    nombreUsuario: str
    codigoUnico: str
    avatarUrl: str  # o Optional[str] si quieres permitir nulos

    class Config:
        from_attributes = True