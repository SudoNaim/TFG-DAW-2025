from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List      
from app.config import get_db
from app.models.post import Post
from app.schemas.post import PostCreate, PostOut

# Ruta estándar para la creación de endpoints referidos a publicaciones
router = APIRouter(prefix="/posts", tags=["posts"])

# Endpoint para crear una publicación
@router.post("/", response_model=PostOut)
def crear_post(post: PostCreate, db: Session = Depends(get_db)):
    print("🟢 Datos recibidos:", post)
    print("🟢 Como dict:", post.dict())

    # devolución de datos según el esquema en pydantic
    nuevo_post = Post(
        titulo=post.titulo,
        imagen_url=post.imagen_url,
        valoracion=post.valoracion,
        categoria=post.categoria,
        resena=post.resena,
        user_id=post.user_id  # ¡Usamos directamente!
    )

    db.add(nuevo_post)
    db.commit()
    db.refresh(nuevo_post)
    return nuevo_post

# Endpoint para visualizar las publicaciones de un usuario
@router.get("/{user_id}", response_model=List[PostOut])
def obtener_posts_por_usuario(user_id: int, db: Session = Depends(get_db)):
    return db.query(Post).filter(Post.user_id == user_id).all()
