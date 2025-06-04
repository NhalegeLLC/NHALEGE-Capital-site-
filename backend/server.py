from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import secrets
import jwt
from passlib.context import CryptContext
import asyncio
import json
from bson import ObjectId

# Custom JSON encoder to handle MongoDB ObjectId
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security setup
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
MFA_TOKEN_EXPIRE_MINUTES = 10

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Nhalege Capital API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_admin: bool = False
    mfa_enabled: bool = False
    mfa_method: Optional[str] = None  # 'email', 'sms', 'both'
    phone_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    phone_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    mfa_enabled: Optional[bool] = None
    mfa_method: Optional[str] = None
    phone_number: Optional[str] = None

# MFA Models
class MFARequest(BaseModel):
    email: EmailStr
    method: str  # 'email' or 'sms'

class MFAVerify(BaseModel):
    email: EmailStr
    code: str

class MFAVerification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    code: str
    method: str
    purpose: str  # 'login', 'admin_access'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    verified: bool = False
    attempts: int = 0

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    requires_mfa: bool = False

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None
    is_admin: bool = False

# Utility Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_mfa_code():
    """Generate a 6-digit MFA code"""
    return str(secrets.randbelow(900000) + 100000)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        is_admin: bool = payload.get("is_admin", False)
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, user_id=user_id, is_admin=is_admin)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    
    # Ensure admin status is correctly set from token
    if token_data.is_admin:
        user["is_admin"] = True
        
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Mock MFA Service Functions (replace with real integrations later)
async def send_email_mfa_code(email: str, code: str):
    """Mock email sending - replace with SendGrid integration"""
    logger.info(f"[MOCK] Sending email MFA code {code} to {email}")
    # In production, integrate with SendGrid here
    return {"status": "sent", "message": f"Code sent to {email}"}

async def send_sms_mfa_code(phone: str, code: str):
    """Mock SMS sending - replace with Twilio integration"""
    logger.info(f"[MOCK] Sending SMS MFA code {code} to {phone}")
    # In production, integrate with Twilio here
    return {"status": "sent", "message": f"Code sent to {phone}"}


# Authentication Endpoints
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    # Check if this is the first user (will be admin)
    is_first_user = await db.users.count_documents({}) == 0
    
    user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        phone_number=user_data.phone_number,
        is_admin=is_first_user
    )
    
    await db.users.insert_one(user.dict())
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}, 
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, requires_mfa=False)

@api_router.post("/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    # Verify user credentials
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc or not verify_password(login_data.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user = User(**user_doc)
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Check if MFA is enabled
    if user.mfa_enabled:
        # Create temporary token that requires MFA completion
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id, "mfa_pending": True},
            expires_delta=timedelta(minutes=5)  # Short-lived token
        )
        return Token(access_token=access_token, requires_mfa=True)
    else:
        # Create full access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id, "is_admin": user.is_admin}, 
            expires_delta=access_token_expires
        )
        return Token(access_token=access_token, requires_mfa=False)

@api_router.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "mfa_enabled": current_user.mfa_enabled,
        "mfa_method": current_user.mfa_method,
        "phone_number": current_user.phone_number,
        "last_login": current_user.last_login
    }
# MFA Endpoints
@api_router.post("/mfa/send-code")
async def send_mfa_code(mfa_request: MFARequest):
    # Get user
    user_doc = await db.users.find_one({"email": mfa_request.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = User(**user_doc)
    
    # Generate MFA code
    code = generate_mfa_code()
    expires_at = datetime.utcnow() + timedelta(minutes=MFA_TOKEN_EXPIRE_MINUTES)
    
    # Store verification record
    verification = MFAVerification(
        email=mfa_request.email,
        code=code,
        method=mfa_request.method,
        purpose="login",
        expires_at=expires_at
    )
    await db.mfa_verifications.insert_one(verification.dict())
    
    # Send code via requested method
    if mfa_request.method == "email":
        result = await send_email_mfa_code(mfa_request.email, code)
    elif mfa_request.method == "sms":
        if not user.phone_number:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No phone number registered for SMS"
            )
        result = await send_sms_mfa_code(user.phone_number, code)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid MFA method"
        )
    
    return {
        "message": f"MFA code sent via {mfa_request.method}",
        "expires_in_minutes": MFA_TOKEN_EXPIRE_MINUTES
    }

@api_router.post("/mfa/verify-code", response_model=Token)
async def verify_mfa_code(mfa_verify: MFAVerify):
    # Find the most recent unverified code for this email
    verification_doc = await db.mfa_verifications.find_one({
        "email": mfa_verify.email,
        "verified": False,
        "expires_at": {"$gt": datetime.utcnow()}
    }, sort=[("created_at", -1)])
    
    if not verification_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid verification code found or code expired"
        )
    
    verification = MFAVerification(**verification_doc)
    
    # Increment attempts
    await db.mfa_verifications.update_one(
        {"id": verification.id},
        {"$inc": {"attempts": 1}}
    )
    
    # Check if too many attempts
    if verification.attempts >= 3:
        await db.mfa_verifications.update_one(
            {"id": verification.id},
            {"$set": {"verified": False}}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many verification attempts. Please request a new code."
        )
    
    # Verify code
    if verification.code != mfa_verify.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Mark as verified
    await db.mfa_verifications.update_one(
        {"id": verification.id},
        {"$set": {"verified": True}}
    )
    
    # Get user info
    user_doc = await db.users.find_one({"email": mfa_verify.email})
    user = User(**user_doc)
    
    # Create full access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "is_admin": user.is_admin}, 
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, requires_mfa=False)

@api_router.post("/mfa/send-admin-code")
async def send_admin_mfa_code(mfa_request: MFARequest, current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Generate admin MFA code
    code = generate_mfa_code()
    expires_at = datetime.utcnow() + timedelta(minutes=MFA_TOKEN_EXPIRE_MINUTES)
    
    # Store verification record
    verification = MFAVerification(
        email=mfa_request.email,
        code=code,
        method=mfa_request.method,
        purpose="admin_access",
        expires_at=expires_at
    )
    await db.mfa_verifications.insert_one(verification.dict())
    
    # Send code
    if mfa_request.method == "email":
        result = await send_email_mfa_code(mfa_request.email, code)
    elif mfa_request.method == "sms" and current_user.phone_number:
        result = await send_sms_mfa_code(current_user.phone_number, code)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid MFA method or missing phone number"
        )
    
    return {
        "message": f"Admin MFA code sent via {mfa_request.method}",
        "expires_in_minutes": MFA_TOKEN_EXPIRE_MINUTES
    }

@api_router.post("/mfa/verify-admin-code")
async def verify_admin_mfa_code(mfa_verify: MFAVerify, current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Find admin verification code
    verification_doc = await db.mfa_verifications.find_one({
        "email": mfa_verify.email,
        "purpose": "admin_access",
        "verified": False,
        "expires_at": {"$gt": datetime.utcnow()}
    }, sort=[("created_at", -1)])
    
    if not verification_doc or verification_doc["code"] != mfa_verify.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired admin verification code"
        )
    
    # Mark as verified
    await db.mfa_verifications.update_one(
        {"id": verification_doc["id"]},
        {"$set": {"verified": True}}
    )
    
    return {"message": "Admin access verified", "verified": True}

# User Settings Endpoints
@api_router.put("/user/settings")
async def update_user_settings(settings: UserUpdate, current_user: User = Depends(get_current_user)):
    update_data = {}
    
    if settings.mfa_enabled is not None:
        update_data["mfa_enabled"] = settings.mfa_enabled
    
    if settings.mfa_method is not None:
        if settings.mfa_method not in ["email", "sms", "both"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid MFA method"
            )
        update_data["mfa_method"] = settings.mfa_method
    
    if settings.phone_number is not None:
        update_data["phone_number"] = settings.phone_number
    
    if update_data:
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )
    
    return {"message": "Settings updated successfully"}

# Admin Endpoints
@api_router.get("/admin/users")
async def get_all_users(admin_user: User = Depends(get_admin_user)):
    users = await db.users.find({}, {"hashed_password": 0}).to_list(1000)
    # Convert to JSON-serializable format
    serialized_users = json.loads(json.dumps(users, cls=MongoJSONEncoder))
    return serialized_users

@api_router.get("/admin/mfa-logs")
async def get_mfa_logs(admin_user: User = Depends(get_admin_user)):
    logs = await db.mfa_verifications.find({}).sort("created_at", -1).to_list(100)
    # Convert to JSON-serializable format
    serialized_logs = json.loads(json.dumps(logs, cls=MongoJSONEncoder))
    return serialized_logs

# Original endpoints (keeping for compatibility)
@api_router.get("/")
async def root():
    return {"message": "Nhalege Capital API - MFA Ready"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
