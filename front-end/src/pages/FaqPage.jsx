import React, { useState } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // FAQs grouped by category
  const faqsByCategory = {
    "Account & Login": [
      { question: "How do I reset my password?", answer: "Go to the Login page and click 'Forgot Password'. Follow the instructions sent to your email." },
      { question: "Who can use the UON Community Marketplace?", answer: "The marketplace is primarily for University of Newcastle students, staff, and community members." },
      { question: "Is my data safe?", answer: "Yes. We use secure authentication and encryption to keep your data safe." },
    ],
    "Listings": [
      { question: "How do I create a listing?", answer: "Log in and click the 'Create Listing' button in the navbar. Fill in the details of your item and submit." },
      { question: "How do I edit or delete my listing?", answer: "Go to your Profile page → My Listings. There you can edit details or remove a listing anytime." },
      { question: "Can I upload images with my listing?", answer: "Yes. When creating a listing, you can upload one or more images to better showcase your item." },
    ],
    "Messaging": [
      { question: "How do I send messages to other users?", answer: "On any listing page, click 'Message Seller' to start chatting directly with the owner." },
    ],
    "General & Policies": [
      { question: "Where can I view the Privacy Policy?", answer: "Scroll to the bottom of the site and click 'Privacy Policy', or open it directly from the footer links." },
      { question: "How do I contact the admin team?", answer: "Use the 'Contact Us' link in the footer to reach out to the marketplace administrators." },
      { question: "Is there an About Us page?", answer: "Yes, scroll to the bottom of the site and click 'About Us' to learn more about the UON Community Marketplace." },
      { question: "Can I access the marketplace on mobile?", answer: "Yes. The site is mobile-friendly and works on phones, tablets, and desktop browsers." },
    ],
  };

  const toggleFAQ = (category, index) => {
    const key = `${category}-${index}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  // highlight search term inside text
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: "#ffeb3b", padding: "0 2px" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex : 1 }}>
          <div
            style={{
              padding: "50px 20px",
              minHeight: "100vh",
              background: "linear-gradient(to right, #f7f9fc, #eef2f7)",
            }}
          >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <h1
                style={{
                  marginBottom: "30px",
                  textAlign: "center",
                  color: "#1A1A40",
                  fontSize: "2.5rem",
                  fontWeight: "700",
                }}
              >
                ❓ Frequently Asked Questions
              </h1>

              {/* Search bar */}
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <input
                  type="text"
                  placeholder="Search your question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    padding: "14px 16px",
                    fontSize: "1.05rem",
                    borderRadius: "8px",
                    border: "1px solid #bbb",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                />
              </div>

              {/* Render categories */}
              {Object.keys(faqsByCategory).map((category) => {
                // flatten all questions and filter by search
                const filteredFaqs = faqsByCategory[category].filter(
                  (faq) =>
                    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filteredFaqs.length === 0) return null;

                return (
                  <div key={category} style={{ marginBottom: "40px" }}>
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "20px",
                        color: "#2C4E80",
                        borderLeft: "5px solid #4A72A4",
                        paddingLeft: "10px",
                      }}
                    >
                      {category}
                    </h2>

                    {filteredFaqs.map((faq, index) => {
                      const key = `${category}-${index}`;
                      return (
                        <div
                          key={index}
                          onClick={() => toggleFAQ(category, index)}
                          style={{
                            marginBottom: "15px",
                            padding: "18px 20px",
                            borderRadius: "10px",
                            backgroundColor: openIndex === key ? "#f1f5fb" : "#fff",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h3
                              style={{
                                margin: 0,
                                fontSize: "1.2rem",
                                color: openIndex === key ? "#2C4E80" : "#4A72A4",
                                fontWeight: openIndex === key ? "700" : "600",
                              }}
                            >
                              {highlightText(faq.question)}
                            </h3>
                            <span
                              style={{
                                transform: openIndex === key ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                                fontSize: "1.3rem",
                                color: openIndex === key ? "#2C4E80" : "#666",
                              }}
                            >
                              ▶
                            </span>
                          </div>
                          <div
                            style={{
                              maxHeight: openIndex === key ? "500px" : "0",
                              opacity: openIndex === key ? 1 : 0,
                              overflow: "hidden",
                              transition: "all 0.4s ease",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "#f9fbff",
                                borderLeft: "4px solid #4A72A4",
                                padding: "15px 18px",
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                marginTop: "12px",
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "1.1rem",
                                  lineHeight: "1.7",
                                  color: "#222",
                                }}
                              >
                                {highlightText(faq.answer)}
                              </p>
                            </div>

                            {/* Feedback */}
                            {openIndex === key && (
                              <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#555" }}>
                                Was this helpful?{" "}
                                <span style={{ cursor: "pointer", marginRight: "10px" }}>👍</span>
                                <span style={{ cursor: "pointer" }}>👎</span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Contact us fallback */}
              <div style={{ marginTop: "40px", textAlign: "center" }}>
                <p style={{ fontSize: "1.15rem", fontWeight: "500" }}>
                  Can’t find your question?{" "}
                  <a
                    href="/contact-us"
                    style={{
                      color: "#2C4E80",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    Contact us
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default FaqPage;