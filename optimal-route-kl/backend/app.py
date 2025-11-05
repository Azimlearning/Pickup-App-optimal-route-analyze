
from flask import Flask, jsonify, request
from flask_cors import CORS
import googlemaps
import os
from dotenv import load_dotenv
import requests
import re
import json

# Load environment variables from .env file (for local development)
load_dotenv()

app = Flask(__name__)
# Enable CORS for all domains on all routes
CORS(app)

# Initialize Google Maps client
try:
    gmaps = googlemaps.Client(key=os.environ.get("MAPS_API_KEY"))
except Exception as e:
    print(f"Error initializing Google Maps client: {e}")
    gmaps = None

def get_llm_analysis_and_buffer(route_sequence):
    """Calls the LLM to get a travel advisory and a suggested time buffer."""
    if not route_sequence:
        return {"analysis": "No route provided for analysis.", "buffer_minutes": 0}

    # Instruct the LLM to return a JSON object for robust parsing
    prompt = f"""
    Given the following optimized travel route in Kuala Lumpur: {json.dumps(route_sequence)},
    provide a concise travel advisory. The advisory should highlight potential traffic hotspots,
suggest ideal travel times, and mention any interesting landmarks. 
    
    Your response MUST be a valid JSON object with two keys:
    1. "analysis" (string): The travel advisory text.
    2. "buffer_minutes" (integer): A suggested travel time buffer in minutes based on potential delays.

    Example response:
    {{"analysis": "Your route through the city center may experience congestion around Merdeka Square, especially during peak hours. Consider leaving before 4 PM. You'll pass by the historic Sultan Abdul Samad Building.", "buffer_minutes": 15}}
    """

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "google/gemini-pro",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"} # Request JSON output
            }
        )
        response.raise_for_status()
        
        # Safely parse the JSON response from the LLM
        llm_response_text = response.json()['choices'][0]['message']['content']
        llm_data = json.loads(llm_response_text)

        return {
            "analysis": llm_data.get("analysis", "Advisory not available."),
            "buffer_minutes": int(llm_data.get("buffer_minutes", 0))
        }

    except (requests.exceptions.RequestException, KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Error getting LLM analysis: {e}")
        return {"analysis": "Could not retrieve travel advisory at this time.", "buffer_minutes": 0}

@app.route('/api/status')
def status():
    if gmaps is None:
        return jsonify({
            "status": "Backend is running, but Google Maps client failed to initialize.",
            "error": "Check the MAPS_API_KEY environment variable. It is likely missing or invalid."
        }), 500
    return jsonify({
        "status": "Backend is running and Google Maps client initialized successfully."
    })


@app.route('/api/optimize_route', methods=['POST'])
def optimize_route():
    if gmaps is None:
        return jsonify({'error': 'Google Maps client is not initialized. Check API Key.'}), 500

    data = request.get_json()
    start_location = data.get('start_location')
    final_destination = data.get('final_destination')
    friend_locations = data.get('friend_locations', []) # Defaults to an empty list

    if not start_location or not final_destination:
        return jsonify({'error': 'Start and final destination are required'}), 400

    waypoints = friend_locations

    try:
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ.get("MAPS_API_KEY"),
            "X-Goog-FieldMask": "routes.optimizedIntermediateWaypointIndex,routes.duration,routes.distanceMeters"
        }

        payload = {
            "origin": {"address": start_location},
            "destination": {"address": final_destination},
            "intermediates": [{"address": loc} for loc in waypoints],
            "travelMode": "DRIVE",
            "optimizeWaypointOrder": True,
        }

        response = requests.post(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            json=payload,
            headers=headers
        )
        response.raise_for_status()

        directions_result = response.json()

        if not directions_result or 'routes' not in directions_result or not directions_result['routes']:
            return jsonify({'error': 'Could not calculate the route using Routes API'}), 500

        route = directions_result['routes'][0]
        
        duration_str = route.get('duration', "0s")
        total_time_seconds = int(re.sub(r's$', '', duration_str))
        total_time_minutes = round(total_time_seconds / 60, 1)

        optimized_order = route.get('optimizedIntermediateWaypointIndex', [])
        
        optimized_sequence = []
        optimized_sequence.append(start_location)
        for i in optimized_order:
            optimized_sequence.append(waypoints[i])
        optimized_sequence.append(final_destination)

        # Get LLM analysis and buffer
        llm_result = get_llm_analysis_and_buffer(optimized_sequence)
        
        return jsonify({
            'status': 'success',
            'optimal_sequence': optimized_sequence,
            'total_time_minutes': total_time_minutes,
            'llm_analysis': llm_result['analysis'],
            'llm_buffer_minutes': llm_result['buffer_minutes'],
            'directions': directions_result # Keep raw data for frontend map rendering
        })

    except requests.exceptions.HTTPError as http_err:
        try:
            error_details = http_err.response.json()
        except ValueError:
            error_details = http_err.response.text
        return jsonify({
            'error': "An HTTP error occurred while calling the Routes API.",
            'details': error_details
        }), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=int(os.environ.get('PORT', 8080)), host='0.0.0.0', debug=False)
