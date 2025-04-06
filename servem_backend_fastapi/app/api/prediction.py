from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
import joblib
import os
import numpy as np
from datetime import datetime, timedelta

from ..api.auth import get_current_volunteer
from ..config import settings
from ..database import supabase
from ..utils.ml_helpers import prepare_data_for_model, normalize_features

router = APIRouter()

@router.get("/attendance")
async def predict_event_attendance(
    event_id: str,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Predict attendance for an event.
    """
    # Check if current volunteer is the organizer of the event
    event_response = supabase.table("events").select("organizer_id").eq("id", event_id).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event_response.data[0]["organizer_id"] != current_volunteer["id"]:
        raise HTTPException(status_code=403, detail="Only the event organizer can view attendance predictions")
    
    # Get event details
    event_details_response = supabase.table("events").select("*").eq("id", event_id).execute()
    
    if not event_details_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = event_details_response.data[0]
    
    # Load the attendance prediction model
    model_path = os.path.join(settings.MODEL_DIR, "attendance_model.pkl")
    
    try:
        model = joblib.load(model_path)
        scaler = joblib.load(os.path.join(settings.MODEL_DIR, "attendance_scaler.pkl"))
    except (FileNotFoundError, OSError):
        # If model doesn't exist, return a default prediction
        return {
            "predicted_attendance": event.get("expected_participants", 0),
            "confidence": 0.5,
            "factors": {
                "day_of_week": 0.2,
                "time_of_day": 0.2,
                "category": 0.2,
                "location": 0.2,
                "weather": 0.2
            }
        }
    
    # Extract features from the event
    features = extract_event_features(event)
    
    # Normalize features
    X = np.array([list(features.values())])
    X_scaled, _, _ = normalize_features(X, scaler)
    
    # Make prediction
    predicted_attendance = model.predict(X_scaled)[0]
    
    # Get feature importance
    feature_importance = {}
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        for i, (feature, _) in enumerate(features.items()):
            feature_importance[feature] = float(importances[i])
    else:
        # Default feature importance if not available
        for feature in features:
            feature_importance[feature] = 1.0 / len(features)
    
    return {
        "predicted_attendance": int(predicted_attendance),
        "confidence": 0.7,  # Placeholder confidence value
        "factors": feature_importance
    }

@router.get("/volunteer-retention")
async def predict_volunteer_retention(
    days: int = 90,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Predict volunteer retention for the next X days.
    """
    # Check if current volunteer is an organizer
    if not current_volunteer.get("is_organizer", False):
        raise HTTPException(status_code=403, detail="Only organizers can view retention predictions")
    
    # Load the retention prediction model
    model_path = os.path.join(settings.MODEL_DIR, "retention_model.pkl")
    
    try:
        model = joblib.load(model_path)
        scaler = joblib.load(os.path.join(settings.MODEL_DIR, "retention_scaler.pkl"))
    except (FileNotFoundError, OSError):
        # If model doesn't exist, return a default prediction
        return {
            "predicted_retention_rate": 0.75,
            "confidence": 0.5,
            "at_risk_volunteers": [],
            "factors": {
                "participation_frequency": 0.25,
                "engagement_level": 0.25,
                "volunteer_satisfaction": 0.25,
                "time_since_last_event": 0.25
            }
        }
    
    # Get all volunteers
    volunteers_response = supabase.table("volunteers").select("*").execute()
    
    if not volunteers_response.data:
        return {
            "predicted_retention_rate": 1.0,
            "confidence": 0.5,
            "at_risk_volunteers": [],
            "factors": {}
        }
    
    volunteers = volunteers_response.data
    
    # Prepare data for prediction
    volunteer_features = []
    volunteer_ids = []
    
    for volunteer in volunteers:
        features = extract_volunteer_features(volunteer)
        volunteer_features.append(list(features.values()))
        volunteer_ids.append(volunteer["id"])
    
    # Normalize features
    X = np.array(volunteer_features)
    X_scaled, _, _ = normalize_features(X, scaler)
    
    # Make predictions
    retention_probabilities = model.predict_proba(X_scaled)[:, 1]  # Probability of retention
    
    # Identify at-risk volunteers (retention probability < 0.5)
    at_risk_indices = np.where(retention_probabilities < 0.5)[0]
    at_risk_volunteers = []
    
    for idx in at_risk_indices:
        volunteer_id = volunteer_ids[idx]
        volunteer = next((v for v in volunteers if v["id"] == volunteer_id), None)
        
        if volunteer:
            at_risk_volunteers.append({
                "volunteer_id": volunteer_id,
                "name": volunteer["name"],
                "email": volunteer["email"],
                "retention_probability": float(retention_probabilities[idx]),
                "last_active": volunteer.get("updated_at", volunteer.get("created_at"))
            })
    
    # Calculate overall retention rate
    predicted_retention_rate = float(np.mean(retention_probabilities))
    
    # Get feature importance
    feature_importance = {}
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        feature_names = list(extract_volunteer_features(volunteers[0]).keys())
        for i, feature in enumerate(feature_names):
            feature_importance[feature] = float(importances[i])
    else:
        # Default feature importance if not available
        feature_names = list(extract_volunteer_features(volunteers[0]).keys())
        for feature in feature_names:
            feature_importance[feature] = 1.0 / len(feature_names)
    
    return {
        "predicted_retention_rate": predicted_retention_rate,
        "confidence": 0.7,  # Placeholder confidence value
        "at_risk_volunteers": at_risk_volunteers,
        "factors": feature_importance
    }

def extract_event_features(event):
    """
    Extract features from an event for prediction.
    """
    # Extract day of week (0-6, where 0 is Monday)
    start_datetime = datetime.fromisoformat(event["start_datetime"].replace("Z", "+00:00"))
    day_of_week = start_datetime.weekday()
    
    # Extract time of day (hour as float between 0 and 24)
    time_of_day = start_datetime.hour + start_datetime.minute / 60
    
    # Extract category (convert to numeric)
    category_mapping = {
        "worship": 0,
        "outreach": 1,
        "education": 2,
        "community": 3,
        "service": 4,
        "other": 5
    }
    category = category_mapping.get(event.get("category", "other"), 5)
    
    # Extract location features (simplified)
    location_type = 0  # Default value
    
    # Extract expected participants
    expected_participants = event.get("expected_participants", 0)
    
    # Extract duration in hours
    duration = 2.0  # Default value
    if event.get("end_datetime"):
        end_datetime = datetime.fromisoformat(event["end_datetime"].replace("Z", "+00:00"))
        duration = (end_datetime - start_datetime).total_seconds() / 3600
    
    return {
        "day_of_week": day_of_week,
        "time_of_day": time_of_day,
        "category": category,
        "location_type": location_type,
        "expected_participants": expected_participants,
        "duration": duration
    }

def extract_volunteer_features(volunteer):
    """
    Extract features from a volunteer for prediction.
    """
    # Get events participated
    events_response = supabase.table("event_volunteers").select(
        "id", count="exact"
    ).eq("volunteer_id", volunteer["id"]).eq("status", "attended").execute()
    
    events_participated = events_response.count if events_response.count is not None else 0
    
    # Get hours served
    hours_response = supabase.table("event_volunteers").select(
        "hours_served"
    ).eq("volunteer_id", volunteer["id"]).execute()
    
    total_hours = sum(event.get("hours_served", 0) for event in hours_response.data) if hours_response.data else 0
    
    # Calculate time since last event
    last_event_response = supabase.table("event_volunteers").select(
        "created_at"
    ).eq("volunteer_id", volunteer["id"]).order("created_at", desc=True).limit(1).execute()
    
    days_since_last_event = 365  # Default value (high)
    
    if last_event_response.data:
        last_event_date = datetime.fromisoformat(last_event_response.data[0]["created_at"].replace("Z", "+00:00"))
        days_since_last_event = (datetime.now() - last_event_date).days
    
    # Calculate participation frequency (events per month)
    account_age_days = (datetime.now() - datetime.fromisoformat(volunteer["created_at"].replace("Z", "+00:00"))).days
    account_age_months = max(1, account_age_days / 30)
    participation_frequency = events_participated / account_age_months
    
    # Get number of skills
    num_skills = len(volunteer.get("skills", []))
    
    # Get number of interests
    num_interests = len(volunteer.get("interests", []))
    
    # Get points
    points = volunteer.get("points", 0)
    
    return {
        "events_participated": events_participated,
        "total_hours": total_hours,
        "days_since_last_event": days_since_last_event,
        "participation_frequency": participation_frequency,
        "num_skills": num_skills,
        "num_interests": num_interests,
        "points": points
    }