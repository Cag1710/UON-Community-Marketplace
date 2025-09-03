import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add logic here to send the message to your backend or email service
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#f9f9f9'
      }}>
        <div style={{
          flex: 1,
          maxWidth: 500,
          margin: '40px auto',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
          border: '1px solid #e0e0e0',
          padding: 40,
          fontFamily: 'inherit',
          width: '100%',
        }}>
          <h1 style={{ color: '#4A72A4', fontWeight: 800, marginBottom: 16 }}>Contact Us</h1>
          <p style={{ fontSize: 16, color: '#444', marginBottom: 24 }}>
            Have a question, suggestion, or need help? Fill out the form below and we'll get back to you as soon as possible.
          </p>
          {submitted ? (
            <div style={{ color: '#4A72A4', fontWeight: 600, fontSize: 18, textAlign: 'center', margin: '32px 0' }}>
              Thank you for your message! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: '1.5px solid #bfcbe2',
                  fontSize: 16,
                  background: '#f7fafd'
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: '1.5px solid #bfcbe2',
                  fontSize: 16,
                  background: '#f7fafd'
                }}
              />
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={5}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: '1.5px solid #bfcbe2',
                  fontSize: 16,
                  background: '#f7fafd',
                  resize: 'vertical'
                }}
              />
              <button
                type="submit"
                style={{
                  marginTop: 8,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: 'none',
                  background: '#4A72A4',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#35547a'}
                onMouseOut={e => e.currentTarget.style.background = '#4A72A4'}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ContactUsPage;