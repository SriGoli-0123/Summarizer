from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the summarization pipeline
summarizer = pipeline(task="summarization", model="facebook/bart-large-cnn")

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    summary = summarizer(text, max_length=200, min_length=30, do_sample=False)
    return jsonify(summary)

if __name__ == '__main__':
    app.run(debug=True)
