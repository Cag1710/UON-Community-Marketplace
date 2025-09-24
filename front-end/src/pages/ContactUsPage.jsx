import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQS = [
  {
    question: "How do I create a listing?",
    answer: "Go to the 'Create Listing' page, fill out the form, and submit your item for others to see."
  },
  {
    question: "How do I contact a seller?",
    answer: "Click on a listing and use the 'Message Seller' button to start a conversation."
  },
  {
    question: "Can I edit or delete my listing?",
    answer: ""
  },
  {
    question: "Is my email address visible to others?",
    answer: "No, your email is never shared publicly. Communication happens through the platform's messaging system."
  },
  {
    question: "Who can use this marketplace?",
    answer: "The marketplace is for the UON community. You may need a valid university email to sign up."
  }
];

function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Failed to send message.');
      setSubmitted(true);
    } catch (err) {
      setError('There was a problem sending your message. Please try again later.');
    }
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
        <div
          className="contactus-container"
          style={{
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
            boxSizing: 'border-box'
          }}>
          <h1 style={{ color: '#222', fontWeight: 800, marginBottom: 16 }}>Contact Us</h1>
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
              {error && (
                <div style={{ color: 'red', fontWeight: 500, marginBottom: 8 }}>
                  {error}
                </div>
              )}
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

          {/* FAQ Section */}
          <div className="contactus-faq" style={{ marginTop: 48 }}>
            <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 16 }}>Frequently Asked Questions</h2>
            <div>
              {FAQS.map((faq, idx) => (
                <div key={idx} style={{
                  marginBottom: 12,
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: 8
                }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#35547a',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      padding: 0,
                      outline: 'none'
                    }}
                  >
                    {faq.question}
                    <span style={{
                      float: 'right',
                      fontWeight: 'bold',
                      fontSize: 18
                    }}>
                      {openFaq === idx ? '-' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div style={{
                      marginTop: 6,
                      color: '#444',
                      fontSize: 15,
                      lineHeight: 1.5
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ContactUsPage;