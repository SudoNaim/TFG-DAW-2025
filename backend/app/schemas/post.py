from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

class PostCreate(BaseModel):
    titulo: str
    imagen_url: str | None = None
    valoracion: int = Field(..., ge=0, le=10)
    categoria: Literal["pelicula", "serie", "musica", "libro"]
    resena: str | None = None
    user_id: int  # ¡Sin alias ni alias_name!

class AutorOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class PostOut(BaseModel):
    id: int
    titulo: str
    imagen_url: str | None
    valoracion: int
    categoria: str
    resena: str | None
    fecha: datetime
    user_id: int
    autor: AutorOut

    class Config:
        from_attributes = True
