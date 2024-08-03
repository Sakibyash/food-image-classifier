from flask import Flask, request, send_from_directory, jsonify, render_template_string
import gradio as gr
import requests
import json
import os

app = Flask(__name__)

# Serve the index.html file
@app.route('/')
def index():
    return send_from_directory('', 'index.html')

# Serve static files (CSS, JS)
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# Serve the dish_detail.json file
@app.route('/dish_detail.json')
def get_dish_details():
    return send_from_directory('', 'dish_detail.json')

# Prediction endpoint using Gradio
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save the file to a temporary location
    temp_file_path = os.path.join('temp', file.filename)
    file.save(temp_file_path)
    
    # Load the Gradio interface and make a prediction
    iface = gr.Interface.load("huggingface/Sakibrumu/Food_Image_Classification")
    prediction = iface.predict([temp_file_path])[0]
    
    # Clean up the temporary file
    os.remove(temp_file_path)
    
    return jsonify(prediction)

if __name__ == '__main__':
    if not os.path.exists('temp'):
        os.makedirs('temp')
    app.run(debug=True)
