from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Dict, Optional
from datetime import timedelta
from jose import JWTError

from ..models.volunteer import VolunteerCreate, VolunteerLogin, Volunteer
from ..utils.security import verify_password, get_password_hash, create_access_token, decode_access_token
from ..config import settings
from ..database import supabase

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_volunteer(token: str = Depends(oauth2_scheme)) -> Dict:
    """
    Get the current authenticated volunteer.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = decode_access_token(token)
        volunteer_id = payload.get("sub")
        
        if volunteer_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Get volunteer from database
    response = supabase.table("volunteers").select("*").eq("id", volunteer_id).execute()
    
    if not response.data:
        raise credentials_exception
    
    return response.data[0]

@router.post("/register", response_model=Dict)
async def register_volunteer(volunteer: VolunteerCreate):
    """
    Register a new volunteer.
    """
    # Check if email already exists
    response = supabase.table("volunteers").select("id").eq("email", volunteer.email).execute()
    
    if response.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(volunteer.password)
    
    # Prepare volunteer data
    volunteer_data = volunteer.dict(exclude={"password"})
    volunteer_data["password"] = hashed_password
    volunteer_data["created_at"] = "now()"
    
    # Insert into database
    response = supabase.table("volunteers").insert(volunteer_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to register volunteer")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": response.data[0]["id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "message": "Volunteer registered successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=Dict)
async def login_volunteer(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate a volunteer and return a JWT token.
    """
    # Get volunteer by email
    response = supabase.table("volunteers").select("*").eq("email", form_data.username).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    volunteer = response.data[0]
    
    # Verify password
    if not verify_password(form_data.password, volunteer["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": volunteer["id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=Volunteer)
async def get_current_volunteer_profile(current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Get the current volunteer's profile.
    """
    return current_volunteer

@router.post("/reset-password-request")
async def request_password_reset(email: str):
    """
    Request a password reset.
    """
    # Check if email exists
    response = supabase.table("volunteers").select("id").eq("email", email).execute()
    
    if not response.data:
        # Don't reveal that the email doesn't exist
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate reset token
    volunteer_id = response.data[0]["id"]
    reset_token = create_access_token(
        data={"sub": volunteer_id, "purpose": "password_reset"},
        expires_delta=timedelta(hours=1)
    )
    
    # Store reset token in database
    reset_data = {
        "volunteer_id": volunteer_id,
        "token": reset_token,
        "created_at": "now()",
        "expires_at": "now() + interval '1 hour'"
    }
    
    supabase.table("password_reset_tokens").insert(reset_data).execute()
    
    # In a real application, send an email with the reset link
    # For now, just return the token
    return {
        "message": "If your email is registered, you will receive a password reset link",
        "reset_token": reset_token  # Remove this in production
    }

@router.post("/reset-password")
async def reset_password(token: str, new_password: str):
    """
    Reset a volunteer's password using a reset token.
    """
    try:
        # Verify token
        payload = decode_access_token(token)
        volunteer_id = payload.get("sub")
        purpose = payload.get("purpose")
        
        if volunteer_id is None or purpose != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid token")
        
        # Check if token exists in database
        token_response = supabase.table("password_reset_tokens").select("id").eq(
            "volunteer_id", volunteer_id
        ).eq("token", token).execute()
        
        if not token_response.data:
            raise HTTPException(status_code=400, detail="Invalid token")
        
        # Hash new password
        hashed_password = get_password_hash(new_password)
        
        # Update password
        update_response = supabase.table("volunteers").update({
            "password": hashed_password,
            "updated_at": "now()"
        }).eq("id", volunteer_id).execute()
        
        if not update_response.data:
            raise HTTPException(status_code=500, detail="Failed to reset password")
        
        # Delete used token
        supabase.table("password_reset_tokens").delete().eq("token", token).execute()
        
        return {"message": "Password reset successfully"}
    
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
