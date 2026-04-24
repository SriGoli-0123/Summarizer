import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Briefly = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [protocol, setProtocol] = useState('NARRATIVE');
    const [loading, setLoading] = useState(false);
    const [displayedSummary, setDisplayedSummary] = useState('');

    const protocols = [
        { id: 'NARRATIVE', title: 'Standard Narrative', desc: 'Cohesive abstractive flow.' },
        { id: 'BULLETS', title: 'Tactical Bullets', desc: 'Action-oriented extraction.' },
        { id: 'ELI5', title: 'Simplicity (ELI5)', desc: 'Zero-jargon reconstruction.' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) return;

        setLoading(true);
        setSummary('');
        setDisplayedSummary('');

        try {
            const response = await axios.post('http://127.0.0.1:5001/summarize', { 
                text, 
                protocol 
            });
            setSummary(response.data.summary_text);
        } catch (error) {
            console.error('Extraction failure:', error);
            setSummary(">> ERROR: SYSTEM_ACCESS_FAILED. CHECK_BACKEND_STATUS.");
        } finally {
            setLoading(false);
        }
    };

    // Typewriter Effect
    useEffect(() => {
        if (summary && !loading) {
            let index = 0;
            setDisplayedSummary(''); // Reset before starting
            
            const timer = setInterval(() => {
                if (index < summary.length) {
                    const char = summary[index];
                    setDisplayedSummary((prev) => prev + char);
                    index++;
                } else {
                    clearInterval(timer);
                }
            }, 15);
            
            return () => clearInterval(timer);
        }
    }, [summary, loading]);

    return (
        <div className="briefly-container">
            <div className="main-editor">
                <h1 className="logo">Briefly.</h1>
                <textarea
                    className="input-field"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Deposit source text for deconstruction..."
                />
                
                <div className="output-area">
                    {loading ? (
                        <div className="status-line">RUNNING_EXTRACTION_PIPELINE...</div>
                    ) : (
                        <div className="summary-content typewriter">
                            {displayedSummary}
                        </div>
                    )}
                </div>
            </div>

            <div className="sidebar">
                <div className="protocol-selector">
                    <span className="status-line">SELECT_PROTOCOL</span>
                    {protocols.map((p) => (
                        <div 
                            key={p.id}
                            className={`protocol-option ${protocol === p.id ? 'active' : ''}`}
                            onClick={() => setProtocol(p.id)}
                        >
                            <span className="protocol-title">{p.title}</span>
                            <span className="protocol-desc">{p.desc}</span>
                        </div>
                    ))}
                </div>

                <button 
                    className="summarize-btn" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'PROCESSING...' : 'DECONSTRUCT'}
                </button>

                <div className="status-line" style={{marginTop: 'auto', paddingTop: '2rem'}}>
                    v2.0 // INDEPENDENT_ENGINE
                </div>
            </div>
        </div>
    );
};

export default Briefly;
