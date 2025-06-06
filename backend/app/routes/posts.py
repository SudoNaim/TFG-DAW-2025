from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.post import Post
from app.schemas.post import PostCreate, PostOut

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostOut)
def crear_post(post: PostCreate, db: Session = Depends(get_db)):
    print("🟢 Datos recibidos:", post)
    print("🟢 Como dict:", post.dict())

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

@router.get("/", response_model=list[PostOut])
def obtener_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()
