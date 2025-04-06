from typing import List, Dict, Optional
from uuid import UUID
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

from ..database import supabase
from ..utils.ml_helpers import prepare_data_for_model, normalize_features

def get_volunteer_engagement_score(volunteer_id: UUID) -> float:
    """
    Calculate an engagement score for a volunteer (0-1).
    """
    # Get volunteer activity data
    activity_response = supabase.table("event_volunteers").select(
        "event_id, status, created_at"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if not activity_response.data:
        return 0.0  # No activity = zero engagement
    
    # Calculate recency, frequency, and consistency
    now = datetime.now()
    activities = activity_response.data
    
    # Recency: how recent was their last activity
    last_activity = max(datetime.fromisoformat(a["created_at"]) for a in activities)
    days_since_last = (now - last_activity).days
    recency_score = max(0, 1 - (days_since_last / 90))  # 0 if more than 90 days ago
    
    # Frequency: how many activities in the last 90 days
    recent_activities = [a for a in activities if (now - datetime.fromisoformat(a["created_at"])).days <= 90]
    frequency_score = min(1, len(recent_activities) / 10)  # Max score at 10+ activities
    
    # Consistency: variance in participation over time
    if len(activities) >= 3:
        dates = [datetime.fromisoformat(a["created_at"]) for a in activities]
        date_diffs = [(dates[i] - dates[i-1]).days for i in range(1, len(dates))]
        consistency_score = 1 / (1 + pd.Series(date_diffs).std() / 30)  # Lower variance = higher score
    else:
        consistency_score = 0.5  # Default for few activities
    
    # Combine scores
    engagement_score = 0.4 * recency_score + 0.4 * frequency_score + 0.2 * consistency_score
    return min(1.0, max(0.0, engagement_score))  # Ensure between 0 and 1

def identify_disengaged_volunteers(threshold: float = 0.3, limit: int = 20) -> List[Dict]:
    """
    Identify volunteers who are becoming disengaged.
    """
    # Get all volunteers
    volunteers_response = supabase.table("volunteers").select("id, name, email, last_activity").execute()
    
    if not volunteers_response.data:
        return []
    
    # Calculate engagement scores for each volunteer
    disengaged = []
    for volunteer in volunteers_response.data:
        volunteer_id = UUID(volunteer["id"])
        engagement_score = get_volunteer_engagement_score(volunteer_id)
        
        if engagement_score < threshold:
            disengaged.append({
                "volunteer_id": volunteer["id"],
                "name": volunteer["name"],
                "email": volunteer["email"],
                "engagement_score": engagement_score,
                "last_activity": volunteer.get("last_activity")
            })
    
    # Sort by engagement score (ascending) and limit
    disengaged.sort(key=lambda x: x["engagement_score"])
    return disengaged[:limit]

def predict_churn_risk() -> List[Dict]:
    """
    Predict volunteers at risk of churning using machine learning.
    """
    # Get all volunteers with their activity data
    volunteers_response = supabase.table("volunteers").select("id, name, email, last_activity, created_at").execute()
    
    if not volunteers_response.data:
        return []
    
    # For each volunteer, calculate engagement features
    volunteer_features = []
    for volunteer in volunteers_response.data:
        volunteer_id = volunteer["id"]
        
        # Get activity data
        activity_response = supabase.table("event_volunteers").select(
            "event_id, status, created_at"
        ).eq("volunteer_id", volunteer_id).execute()
        
        # Calculate features
        now = datetime.now()
        
        # Days since last activity
        last_activity = volunteer.get("last_activity")
        days_since_last = (now - datetime.fromisoformat(last_activity)).days if last_activity else 365
        
        # Days since signup
        created_at = volunteer.get("created_at")
        days_since_signup = (now - datetime.fromisoformat(created_at)).days if created_at else 0
        
        # Activity counts
        activities = activity_response.data if activity_response.data else []
        total_activities = len(activities)
        
        # Recent activities (last 90 days)
        recent_activities = [
            a for a in activities 
            if a.get("created_at") and (now - datetime.fromisoformat(a["created_at"])).days <= 90
        ]
        recent_activity_count = len(recent_activities)
        
        # Completion rate
        completed_activities = [a for a in activities if a.get("status") == "completed"]
        completion_rate = len(completed_activities) / total_activities if total_activities > 0 else 0
        
        # Add to features list
        volunteer_features.append({
            "volunteer_id": volunteer_id,
            "name": volunteer["name"],
            "email": volunteer["email"],
            "days_since_last": days_since_last,
            "days_since_signup": days_since_signup,
            "total_activities": total_activities,
            "recent_activity_count": recent_activity_count,
            "completion_rate": completion_rate
        })
    
    # If we don't have enough data, return based on simple heuristic
    if len(volunteer_features) < 10:
        # Sort by days_since_last (descending) and return top 5
        at_risk = sorted(volunteer_features, key=lambda x: x["days_since_last"], reverse=True)
        for volunteer in at_risk:
            # Calculate a simple risk score
            if volunteer["total_activities"] > 0:
                risk_score = min(1.0, volunteer["days_since_last"] / 90) * (1 - volunteer["recent_activity_count"] / max(1, volunteer["total_activities"]))
            else:
                risk_score = min(1.0, volunteer["days_since_last"] / 90)
            
            volunteer["churn_risk"] = risk_score
        
        return [v for v in at_risk if v["churn_risk"] > 0.5][:5]
    
    # Prepare data for ML model
    features = ["days_since_last", "days_since_signup", "total_activities", "recent_activity_count", "completion_rate"]
    
    # We don't have labeled data for churn, so we'll use a heuristic to create labels
    # Consider a volunteer churned if they haven't been active in 90+ days
    for volunteer in volunteer_features:
        volunteer["churned"] = 1 if volunteer["days_since_last"] > 90 else 0
    
    # Prepare data
    X, y = prepare_data_for_model(volunteer_features, features, "churned")
    
    # Normalize features
    X_scaled, _, _ = normalize_features(X)
    
    # Train a simple model
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X_scaled, y)
    
    # Predict churn probability for all volunteers
    churn_probs = model.predict_proba(X_scaled)[:, 1]  # Probability of class 1 (churned)
    
    # Add predictions to the volunteer data
    for i, volunteer in enumerate(volunteer_features):
        volunteer["churn_risk"] = float(churn_probs[i])
    
    # Sort by churn risk (descending) and return high-risk volunteers
    at_risk = sorted(volunteer_features, key=lambda x: x["churn_risk"], reverse=True)
    return [v for v in at_risk if v["churn_risk"] > 0.5][:10]

def get_engagement_trends(months: int = 6) -> Dict:
    """
    Get engagement trends over time.
    """
    # Get all volunteers
    volunteers_response = supabase.table("volunteers").select("id, created_at").execute()
    
    if not volunteers_response.data:
        return {"labels": [], "active_rate": [], "new_volunteers": []}
    
    # Get all activities
    activities_response = supabase.table("event_volunteers").select("volunteer_id, created_at").execute()
    
    # Convert to DataFrames
    volunteers_df = pd.DataFrame(volunteers_response.data)
    volunteers_df['created_at'] = pd.to_datetime(volunteers_df['created_at'])
    
    activities_df = pd.DataFrame(activities_response.data) if activities_response.data else pd.DataFrame(columns=['volunteer_id', 'created_at'])
    if not activities_df.empty:
        activities_df['created_at'] = pd.to_datetime(activities_df['created_at'])
    
    # Calculate monthly stats
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30 * months)
    
    # Monthly date range
    date_range = pd.date_range(start=start_date, end=end_date, freq='M')
    
    # New volunteers per month
    monthly_new_volunteers = volunteers_df[volunteers_df['created_at'] >= start_date].groupby(
        pd.Grouper(key='created_at', freq='M')
    ).size()
    
    # Fill in missing months with zeros
    monthly_new_volunteers = monthly_new_volunteers.reindex(date_range, fill_value=0)
    
    # Active rate per month
    monthly_active_rate = []
    
    for month_end in date_range:
        month_start = month_end - timedelta(days=30)
        
        # Total volunteers registered by this month
        total_volunteers = len(volunteers_df[volunteers_df['created_at'] <= month_end])
        
        if total_volunteers == 0:
            monthly_active_rate.append(0)
            continue
        
        # Active volunteers this month (had at least one activity)
        if activities_df.empty:
            active_volunteers = 0
        else:
            active_volunteers = activities_df[
                (activities_df['created_at'] >= month_start) & 
                (activities_df['created_at'] <= month_end)
            ]['volunteer_id'].nunique()
        
        # Calculate active rate
        active_rate = active_volunteers / total_volunteers
        monthly_active_rate.append(active_rate)
    
    # Format the response
    labels = [date.strftime('%b %Y') for date in date_range]
    
    return {
        "labels": labels,
        "active_rate": monthly_active_rate,
        "new_volunteers": monthly_new_volunteers.tolist()
    }