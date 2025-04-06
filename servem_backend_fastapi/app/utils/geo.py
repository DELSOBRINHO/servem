import math
from typing import Tuple, Optional

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the distance between two points on Earth using the Haversine formula.
    
    Args:
        lat1: Latitude of point 1 in degrees
        lon1: Longitude of point 1 in degrees
        lat2: Latitude of point 2 in degrees
        lon2: Longitude of point 2 in degrees
        
    Returns:
        Distance in kilometers
    """
    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # Earth radius in kilometers
    radius = 6371
    
    # Calculate distance
    distance = radius * c
    
    return distance

def get_bounding_box(lat: float, lon: float, radius_km: float) -> Tuple[float, float, float, float]:
    """
    Calculate a bounding box around a point given a radius in kilometers.
    
    Args:
        lat: Latitude of center point in degrees
        lon: Longitude of center point in degrees
        radius_km: Radius in kilometers
        
    Returns:
        Tuple of (min_lat, min_lon, max_lat, max_lon)
    """
    # Earth's radius in kilometers
    earth_radius = 6371
    
    # Angular distance in radians on a great circle
    angular_distance = radius_km / earth_radius
    
    # Convert latitude and longitude from degrees to radians
    lat_rad = math.radians(lat)
    lon_rad = math.radians(lon)
    
    # Calculate min and max latitudes
    min_lat = lat_rad - angular_distance
    max_lat = lat_rad + angular_distance
    
    # Convert back to degrees
    min_lat = math.degrees(min_lat)
    max_lat = math.degrees(max_lat)
    
    # Calculate min and max longitudes
    # The delta longitude gets smaller as we move away from the equator
    delta_lon = math.asin(math.sin(angular_distance) / math.cos(lat_rad))
    
    min_lon = lon_rad - delta_lon
    max_lon = lon_rad + delta_lon
    
    # Convert back to degrees
    min_lon = math.degrees(min_lon)
    max_lon = math.degrees(max_lon)
    
    return min_lat, min_lon, max_lat, max_lon

def geocode_address(address: str) -> Optional[Tuple[float, float]]:
    """
    Convert an address to latitude and longitude coordinates.
    
    This is a placeholder function. In a real application, you would use a geocoding service
    like Google Maps, Mapbox, or OpenStreetMap.
    
    Args:
        address: Address string
        
    Returns:
        Tuple of (latitude, longitude) or None if geocoding failed
    """
    # In a real application, you would implement geocoding using a service API
    # For example, using the Google Maps Geocoding API:
    # 
    # import requests
    # 
    # api_key = "your_google_maps_api_key"
    # url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={api_key}"
    # 
    # response = requests.get(url)
    # data = response.json()
    # 
    # if data["status"] == "OK":
    #     location = data["results"][0]["geometry"]["location"]
    #     return location["lat"], location["lng"]
    # else:
    #     return None
    
    # For now, return a placeholder value for testing
    return None