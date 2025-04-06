from typing import Dict, Optional
from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

from ..database import supabase

# Simple in-memory model cache
_prediction_model = None

def _load_or_train_model(force_retrain: bool = False):
    """
    Load the prediction model or train a new one if it doesn't exist.
    """
    global _prediction_model
    
    # Check if we already have a model in memory and don't need to retrain
    if _prediction_model is not None and not force_retrain:
        return _prediction_model
    
    # Check if we have a saved model file
    model_path = "app/models/volunteer_needs_model.joblib"
    if os.path.exists(model_path) and not force_retrain:
        try:
            _prediction_model = joblib.load(model_path)
            return _prediction_model
        except:
            # If loading fails, we'll train a new model
            pass
    
    # Get historical event data
    response = supabase.table("events").select(
        "id, type, expected_participants, volunteers_needed, start_datetime"
    ).execute()
    
    if not response.data or len(response.data) < 10:
        # Not enough data to train a model
        # Return a simple default model
        model = LinearRegression()
        model.coef_ = np.array([0.05, 0])  # Default: 1 volunteer per 20 participants
        model.intercept_ = 2     # Minimum 2 volunteers
        _prediction_model = model
        return model
    
    # Prepare training data
    df = pd.DataFrame(response.data)
    
    # Convert event type to numeric (one-hot encoding)
    event_types = pd.get_dummies(df['type'], prefix='type')
    df = pd.concat([df, event_types], axis=1)
    
    # Extract day of week and time of day features
    df['start_datetime'] = pd.to_datetime(df['start_datetime'])
    df['day_of_week'] = df['start_datetime'].dt.dayofweek
    df['hour_of_day'] = df['start_datetime'].dt.hour
    
    # Features: expected_participants, event type, day of week, hour of day
    X = pd.concat([
        df[['expected_participants', 'day_of_week', 'hour_of_day']], 
        event_types
    ], axis=1)
    y = df['volunteers_needed']
    
    # Train model (use RandomForest if we have enough data)
    if len(df) >= 30:
        model = RandomForestRegressor(n_estimators=100, random_state=42)
    else:
        model = LinearRegression()
    
    model.fit(X, y)
    
    # Save the model
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    
    _prediction_model = model
    return model

def predict_volunteer_needs(
    event_type: str, 
    expected_participants: int,
    event_date: Optional[datetime] = None
) -> Dict:
    """
    Predict the number of volunteers needed for an event.
    """
    model = _load_or_train_model()
    
    # Set default event date if not provided
    if event_date is None:
        event_date = datetime.now() + timedelta(days=14)  # Default to 2 weeks from now
    
    # Extract day of week and hour of day
    day_of_week = event_date.weekday()
    hour_of_day = event_date.hour
    
    # Prepare input data
    # This is simplified - in a real app, you'd need to handle the one-hot encoding properly
    # by matching the exact columns used during training
    X = np.zeros((1, 3 + 1))  # 3 numeric features + 1 event type
    X[0, 0] = expected_participants
    X[0, 1] = day_of_week
    X[0, 2] = hour_of_day
    X[0, 3] = 1 if event_type == "Culto Jovem" else 0  # Simplified
    
    # Make prediction
    prediction = max(2, round(model.predict(X)[0]))  # Ensure at least 2 volunteers
    
    # Add confidence level (simplified)
    confidence = 0.7  # Fixed confidence for now
    
    # In a real application, you would calculate confidence based on:
    # 1. Amount of training data for this event type
    # 2. Variance in the predictions (e.g., using prediction intervals)
    # 3. How similar this event is to past events
    
    return {
        "predicted_volunteers_needed": prediction,
        "confidence": confidence,
        "event_type": event_type,
        "expected_participants": expected_participants,
        "event_date": event_date.isoformat() if event_date else None
    }

def predict_attendance(event_id: str) -> Dict:
    """
    Predict the expected attendance for an event.
    """
    # Get event details
    event_response = supabase.table("events").select(
        "id, type, expected_participants, start_datetime"
    ).eq("id", event_id).execute()
    
    if not event_response.data:
        raise ValueError(f"Event with ID {event_id} not found")
    
    event = event_response.data[0]
    
    # Get historical attendance data for similar events
    similar_events_response = supabase.table("events").select(
        "id, type, expected_participants, actual_participants"
    ).eq("type", event["type"]).not_("actual_participants", "is", "null").execute()
    
    # If we don't have enough historical data, return the expected participants
    if not similar_events_response.data or len(similar_events_response.data) < 5:
        return {
            "event_id": event_id,
            "expected_participants": event["expected_participants"],
            "predicted_attendance": event["expected_participants"],
            "confidence": 0.5
        }
    
    # Calculate the average ratio of actual to expected participants
    attendance_ratios = []
    for similar_event in similar_events_response.data:
        if similar_event["expected_participants"] > 0:
            ratio = similar_event["actual_participants"] / similar_event["expected_participants"]
            attendance_ratios.append(ratio)
    
    # Calculate the mean and standard deviation of the ratios
    mean_ratio = np.mean(attendance_ratios)
    std_ratio = np.std(attendance_ratios)
    
    # Predict attendance
    predicted_attendance = round(event["expected_participants"] * mean_ratio)
    
    # Calculate confidence (higher when standard deviation is lower)
    confidence = 1 / (1 + std_ratio)
    
    return {
        "event_id": event_id,
        "expected_participants": event["expected_participants"],
        "predicted_attendance": predicted_attendance,
        "confidence": min(0.95, confidence)  # Cap at 0.95
    }