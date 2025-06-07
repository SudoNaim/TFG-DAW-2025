# app/routes/amigos.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.user import User
from app.models.post import Post
from app.schemas.post import PostOut

router = APIRouter(prefix="/amigos", tags=["amigos"])

@router.get("/perfil/{amigo_id}", response_model=dict)
def obtener_perfil_amigo(amigo_id: int, db: Session = Depends(get_db)):
    amigo = db.query(User).filter(User.id == amigo_id).first()
    if not amigo:
        raise HTTPException(status_code=404, detail="Amigo no encontrado")

    publicaciones = db.query(Post).filter(Post.user_id == amigo.id).all()
    return {
        "nombre": amigo.username,
        "avatarUrl": f"https://placehold.co/100x100/FFC107/000000?text={amigo.username[:2].upper()}",
        "publicaciones": [PostOut.from_orm(p) for p in publicaciones]
    }
