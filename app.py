from flask import Flask, request, jsonify
from gradio_client import Client

app = Flask(__name__)

client = Client("Sakibrumu/Food_Image_Classification")

@app.route('/predict', methods=['POST'])
def predict():
    if 'img' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['img']
    result = client.predict(img=file, api_name="/predict")
    return jsonify({'label': result['label'], 'probability': result['probability']})

if __name__ == '__main__':
    app.run(debug=True)
