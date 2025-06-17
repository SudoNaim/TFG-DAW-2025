from pydantic import BaseModel

# Esquemas de pydantic, en este caso para el añadir amigos, y la visualización de los datos de tus amigos
class FriendAdd(BaseModel):
    friend_code: str
class FriendOut(BaseModel):
    idUsuario: int
    nombreUsuario: str
    codigoUnico: str
    avatarUrl: str

    class Config:
        from_attributes = True