from typing import List
from ..models.volunteer import Volunteer, VolunteerSearchParams
from ..database import supabase
from ..utils.geo import calculate_distance

def search_volunteers_by_location_and_skills(params: VolunteerSearchParams) -> List[Volunteer]:
    """
    Search for volunteers based on location, skills, and availability using PostGIS.
    """
    # Build the RPC call to the Supabase function
    query_params = {
        "lat": params.latitude,
        "long": params.longitude,
        "max_distance": params.max_distance_km
    }
    
    # Add skills filter if provided
    skills_filter = ""
    if params.skills and len(params.skills) > 0:
        skills_list = "','".join(params.skills)
        skills_filter = f"AND skills && ARRAY['{skills_list}']"
        
    # Add availability filter if provided
    availability_filter = ""
    if params.availability_day is not None:
        availability_filter = f"AND EXISTS (SELECT 1 FROM availabilities a WHERE a.volunteer_id = v.id AND a.day_of_week = {params.availability_day})"
    
    # Execute the RPC function
    response = supabase.rpc(
        "search_volunteers_by_location",
        query_params
    ).execute()
    
    if not response.data:
        return []
    
    # Convert to Volunteer objects
    volunteers = [Volunteer(**volunteer_data) for volunteer_data in response.data]
    return volunteers