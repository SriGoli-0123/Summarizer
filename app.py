import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load the summarization pipeline
summarizer = pipeline(task="summarization", model="facebook/bart-large-cnn")

def format_as_bullets(text):
    # Split by common sentence delimiters and cleanup
    sentences = re.split(r'(?<=[.!?]) +', text)
    bullets = [f"• {s.strip()}" for s in sentences if len(s.strip()) > 5]
    return "\n".join(bullets)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')
    protocol = data.get('protocol', 'NARRATIVE')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Protocol Configurations
    configs = {
        'NARRATIVE': {'max_length': 150, 'min_length': 40, 'num_beams': 4, 'length_penalty': 2.0},
        'BULLETS': {'max_length': 200, 'min_length': 60, 'num_beams': 2, 'repetition_penalty': 1.2},
        'ELI5': {'max_length': 60, 'min_length': 10, 'num_beams': 1, 'do_sample': True, 'temperature': 0.8}
    }

    config = configs.get(protocol, configs['NARRATIVE'])
    
    try:
        summary_raw = summarizer(text, **config)[0]['summary_text']
        
        final_summary = summary_raw
        if protocol == 'BULLETS':
            final_summary = format_as_bullets(summary_raw)
            
        return jsonify({
            'summary_text': final_summary,
            'protocol': protocol,
            'meta': config
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
