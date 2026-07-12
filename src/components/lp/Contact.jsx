import React from "react";
import LeadForm from "./LeadForm";

export default function Contact({ data = {} }) {
  const {
    eyebrow = "GET IN TOUCH",
    headline = "Ready to Transform Your Space?",
    body = "Discuss your requirements with our design experts today.",
    address = "123 Design Avenue, Tech Park, City - 400001",
    phone = "+91 98765 43210",
    email = "hello@adroitdesign.com"
  } = data;

  return (
    <section className="contact bg-charcoal" id="contact">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
            {body && <p className="lead" style={{ marginTop: "24px" }} dangerouslySetInnerHTML={{ __html: body }} />}
            
            <div className="contact-details">
              <div>
                <h5>Address</h5>
                <p>{address}</p>
              </div>
              <div>
                <h5>Phone</h5>
                <p>{phone}</p>
              </div>
              <div>
                <h5>Email</h5>
                <p>{email}</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-wrapper">
            <h3 style={{ marginBottom: "24px", fontFamily: "var(--mono)", fontSize: "16px", letterSpacing: "0.05em" }}>QUICK ENQUIRY</h3>
            <LeadForm data={data} onSuccess={() => alert("Thank you! Your details have been submitted.")} />
          </div>
        </div>
      </div>
    </section>
  );
}
