import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from "../Components";

const Newsletter = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle sending promotional email
  const sendPromoHandler = async () => {
    if (!subject || !message) {
      setStatus('Please fill out both subject and message');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('https://ftfl-backend.vercel.app/api/newsletter/send', { subject, message });
      setStatus('Promotional email sent successfully!');
      setLoading(false);
    } catch (error) {
      setStatus('Error sending promotional email');
      setLoading(false);
    }
  };

  return (
    
    <div className="container mt-5">
        <Header category="" title="Newsletter" />

      <div className="row">
        <div className="col-md-6 mx-auto">
          <h3 className="text-center"></h3>

          {/* Promotional Email Form */}
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              className="form-control"
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your promotional message"
            />
          </div>

          <button className="btn btn-success w-100" onClick={sendPromoHandler} disabled={loading}>
            {loading ? 'Sending...' : 'Send Email'}
          </button>

          {/* Status Message */}
          {status && <div className="mt-3 alert alert-info">{status}</div>}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
