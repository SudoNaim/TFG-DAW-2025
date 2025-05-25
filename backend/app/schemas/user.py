from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
# Datos que se esperan al crear un usuario en base de datos, con esto validamos los tipos de datos

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
#   fecha_registro: datetime
#   perfil_publico: bool
# Datos que se esperan al recoger información de un usuario, como por ejemplo si un usuario normal quiere ver el perfil de otro
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    
