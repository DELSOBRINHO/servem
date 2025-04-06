import numpy as np
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Optional, Any

def prepare_data_for_model(data: list, features: list) -> np.ndarray:
    """
    Prepare data for ML model input.
    """
    X = []
    for item in data:
        row = []
        for feature in features:
            row.append(item.get(feature, 0))
        X.append(row)
    
    return np.array(X)

def normalize_features(X: np.ndarray, scaler: Optional[StandardScaler] = None) -> Tuple[np.ndarray, StandardScaler, bool]:
    """
    Normalize features using StandardScaler.
    """
    created_new_scaler = False
    
    if scaler is None:
        scaler = StandardScaler()
        scaler.fit(X)
        created_new_scaler = True
    
    X_scaled = scaler.transform(X)
    
    return X_scaled, scaler, created_new_scaler

def calculate_feature_importance(model, feature_names: List[str]) -> Dict[str, float]:
    """
    Calculate and return feature importance from a trained model.
    
    Args:
        model: Trained model with feature_importances_ attribute
        feature_names: List of feature names
        
    Returns:
        Dictionary mapping feature names to importance scores
    """
    if not hasattr(model, 'feature_importances_'):
        raise ValueError("Model does not have feature_importances_ attribute")
    
    importances = model.feature_importances_
    
    # Create a dictionary of feature importances
    feature_importance = {}
    for i, feature in enumerate(feature_names):
        feature_importance[feature] = float(importances[i])
    
    # Sort by importance (descending)
    feature_importance = dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True))
    
    return feature_importance