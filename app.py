from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# Define your Hugging Face Gradio Space API URL
HF_API_URL = 'https://sakibrumu-food-image-classification.hf.space/api/predict/'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    files = {'file': (file.filename, file.read(), file.content_type)}

    try:
        response = requests.post(HF_API_URL, files=files)
        if not response.ok:
            print(f"Response status code: {response.status_code}")
            print(f"Response content: {response.content}")
            return jsonify({'error': f'Network response was not ok: {response.content.decode()}'}), response.status_code
        result = response.json()
        return jsonify(result)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return jsonify({'error': f'Request failed: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
