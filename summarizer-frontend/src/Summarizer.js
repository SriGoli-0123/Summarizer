import React, { useState } from 'react';
import axios from 'axios';

const Summarizer = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/summarize', { text });
            setSummary(response.data[0].summary_text);
        } catch (error) {
            console.error('Error summarizing text:', error);
        }
    };

    return (
        <div>
            <h1>Text Summarizer</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="10"
                    cols="50"
                    placeholder="Enter text to summarize"
                />
                <br />
                <button type="submit">Summarize</button>
            </form>
            {summary && (
                <div>
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default Summarizer;
