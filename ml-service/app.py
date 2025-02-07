from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import os

app = Flask(__name__)
CORS(app)

# Inicialización de Firebase
try:
    db = firestore.client()
except:
    cred_dict = {
        "type": os.environ.get("FIREBASE_TYPE"),
        "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
        "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
        "auth_uri": os.environ.get("FIREBASE_AUTH_URI"),
        "token_uri": os.environ.get("FIREBASE_TOKEN_URI"),
        "auth_provider_x509_cert_url": os.environ.get("FIREBASE_AUTH_PROVIDER_CERT_URL"),
        "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_CERT_URL")
    }
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)
    db = firestore.client()

def get_user_data(user_id):
    collections = [
        "gameDetailsAnimales", "gameDetailsAnimalesNumeros",
        "gameDetailsAnimalesVocales", "gameDetailsCerditos",
        "gameDetailsColores", "gameDetailsColoresFormas",
        "gameDetailsFiguras", "gameDetailsNumeros",
        "gameDetailsPatitos", "gameDetailsVocales"
    ]
    
    all_data = {}
    for collection_name in collections:
        doc = db.collection(collection_name).document(user_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            all_data[collection_name] = pd.DataFrame([data])
    return all_data

def process_attempts(data):
    records = []
    collection_to_category = {
        "gameDetailsAnimalesNumeros": "animales-numeros",
        "gameDetailsAnimalesVocales": "animales-vocales",
        "gameDetailsColoresFormas": "colores-formas"
    }

    for collection_name, df in data.items():
        category = collection_to_category.get(collection_name, collection_name.replace('gameDetails', '').lower())
        if category == 'numeros':
            category = 'numbers'
            
        for _, row in df.iterrows():
            if category in row and isinstance(row[category], dict) and 'attempts' in row[category]:
                attempts = row[category].get('attempts', {})
                if isinstance(attempts, dict):
                    for attempt_id, attempt in attempts.items():
                        if isinstance(attempt, dict) and 'details' in attempt:
                            for item, details in attempt['details'].items():
                                if isinstance(details, dict):
                                    records.append({
                                        'user_id': row['id'],
                                        'category': category,
                                        'attempt_id': attempt_id,
                                        'item': item,
                                        'errors': details.get('errors', 0),
                                        'time': details.get('time', 0),
                                        'result': details.get('resultado', False),
                                        'timer_value': attempt.get('timerValue', 10),
                                        'total_errors': attempt.get('totalErrors', 0),
                                        'total_time': attempt.get('totalTime', 0),
                                        'completed': attempt.get('completed', False)
                                    })
    return pd.DataFrame(records)

class GameML:
    def __init__(self):
        self.timer_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.review_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()

    def train_timer_model(self, data):
        X = data[['errors', 'time', 'result']]
        
        # Calculamos el tiempo recomendado basado en el rendimiento
        baseline_time = 10
        performance_factor = (data['errors'] * 1.5 + data['time'] * 0.5) / 2
        y = baseline_time + performance_factor
        y = np.clip(y, 5, 15)
        
        X_scaled = self.scaler.fit_transform(X)
        self.timer_model.fit(X_scaled, y)

    def train_review_model(self, data):
        X = data[['errors', 'time', 'result']]
        y = data['needs_review']
        X_scaled = self.scaler.fit_transform(X)
        self.review_model.fit(X_scaled, y)

    def predict_timer(self, data):
        X = data[['errors', 'time', 'result']]
        X_scaled = self.scaler.transform(X)
        predictions = self.timer_model.predict(X_scaled)
        return np.clip(predictions, 5, 15)

    def predict_review(self, data):
        X = data[['errors', 'time', 'result']]
        X_scaled = self.scaler.transform(X)
        return self.review_model.predict(X_scaled)

def get_predictions(user_id, processed_data):
    game_ml = GameML()
    user_data = processed_data[processed_data['user_id'] == user_id].copy()
    
    # Añadir columna needs_review
    user_data['needs_review'] = (user_data['errors'] > 2) | (user_data['time'] > 6)
    
    # Split data para entrenamiento
    train_data, predict_data = train_test_split(user_data, test_size=0.3, random_state=42)
    
    game_ml.train_timer_model(train_data)
    game_ml.train_review_model(train_data)
    
    predict_data = predict_data.drop(columns=['needs_review'])
    predictions = {'level1': {}, 'level2': {}, 'level3': {}}

    # Nivel 1
    for category in ['animales', 'numbers', 'vocales', 'figuras', 'colores']:
        category_data = predict_data[predict_data['category'] == category]
        if not category_data.empty:
            timer_predictions = game_ml.predict_timer(category_data)
            review_predictions = game_ml.predict_review(category_data)
            
            base_timer = float(np.mean(timer_predictions))
            recommended_timer = int(np.floor(np.clip(base_timer, 5, 15)))
            
            predictions['level1'][category] = {
                'recommended_timer': recommended_timer,
                'avg_errors': float(category_data['errors'].mean()),
                'avg_time': float(category_data['time'].mean()),
                'needs_review': bool(np.any(review_predictions))
            }

    # Nivel 2
    level2_categories = {
        'animales-numeros': ['animales', 'numbers'],
        'animales-vocales': ['animales', 'vocales'],
        'colores-formas': ['colores', 'figuras']
    }

    for combo, base_categories in level2_categories.items():
        base_data = predict_data[predict_data['category'].isin(base_categories)]
        if not base_data.empty:
            timer_predictions = game_ml.predict_timer(base_data)
            review_predictions = game_ml.predict_review(base_data)
            
            recommended_timer = int(np.floor(np.mean(timer_predictions)))
            avg_errors = float(base_data['errors'].mean())
            avg_time = float(base_data['time'].mean())
            success_rate = float(base_data['result'].astype(int).mean())

            difficulty = 'high' if avg_errors > 2 or avg_time > 6 or success_rate < 0.7 else \
                        'medium' if avg_errors > 1 or avg_time > 4 else 'low'

            predictions['level2'][combo] = {
                'recommended_timer': recommended_timer,
                'difficulty': difficulty,
                'avg_errors': avg_errors,
                'avg_time': avg_time,
                'needs_review': bool(np.any(review_predictions))
            }

    # Nivel 3
    for category in ['patitos', 'cerditos']:
        category_data = predict_data[predict_data['category'] == category]
        if not category_data.empty:
            timer_predictions = game_ml.predict_timer(category_data)
            review_predictions = game_ml.predict_review(category_data)
            
            recommended_timer = int(np.floor(np.mean(timer_predictions)))
            avg_errors = float(category_data['errors'].mean())
            avg_time = float(category_data['time'].mean())
            
            difficulty = 'low' if avg_errors <= 1 and avg_time <= 4 else \
                        'medium' if avg_errors <= 2 else 'high'

            predictions['level3'][category] = {
                'recommended_timer': recommended_timer,
                'difficulty': difficulty,
                'avg_errors': avg_errors,
                'avg_time': avg_time,
                'needs_review': bool(np.any(review_predictions))
            }

    return predictions

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/predict/<user_id>', methods=['GET'])
def predict(user_id):
    try:
        collections_data = get_user_data(user_id)
        processed_data = process_attempts(collections_data)
        predictions = get_predictions(user_id, processed_data)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)