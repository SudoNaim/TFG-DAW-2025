from pydantic import BaseModel, EmailStr

# Igual que anteriormente, esquemas necesarios para las funcionalidades relacionadas con el usuario
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class BioUpdate(BaseModel):
    bio: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    bio: str | None = None
    friend_code: str | None = None
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class EmailUpdate(BaseModel):              
    email: EmailStr
