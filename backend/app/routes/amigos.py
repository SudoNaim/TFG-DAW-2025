# app/routes/amigos.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.user import User
from app.models.post import Post
from app.schemas.post import PostOut
from app.schemas.friend import FriendAdd 
from app.models.friendship import amigos_table 

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

@router.post("/{user_id}", status_code=201)
def añadir_amigo(user_id: int, payload: FriendAdd, db: Session = Depends(get_db)):
    # 1) Buscamos al usuario “dueño” del código
    amigo = db.query(User).filter(User.friend_code == payload.friend_code).first()
    if not amigo:
        raise HTTPException(404, "Código de amigo no válido")

    # 2) Comprobamos que no sea el mismo
    if amigo.id == user_id:
        raise HTTPException(400, "No te puedes añadir a ti mismo")

    # 3) insertamos la relación en ambas direcciones
    # — de user_id hacia amigo.id
    db.execute(
        amigos_table.insert().values(
            user_id=user_id,
            friend_id=amigo.id
        )
    )
    # — y de amigo.id hacia user_id
    db.execute(
        amigos_table.insert().values(
            user_id=amigo.id,
            friend_id=user_id
        )
    )
    db.commit()

    return {"message": f"{amigo.username} añadido a tu lista de amigos"}