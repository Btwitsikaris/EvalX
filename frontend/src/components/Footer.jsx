import React from "react";
import { Mail, Sparkles } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="siteFooter" id="about">
      <div className="footerTop">
        <div className="footerBrand">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Logo />
          </div>
          <p>
            AI-powered evaluation for handwritten answer sheets — OCR
            extraction, automated scoring, and transparent feedback for
            teachers and students.
          </p>
        </div>

        <div className="footerCol footerContact">
          <h4>Contact</h4>
          <span className="footerName">Aniket</span>
          <a href="mailto:aniketmajumdar2006@gmail.com" className="footerEmail">
            <Mail size={13} aria-hidden="true" />
            <span>aniketmajumdar2006@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="footerBottom">
        <div className="stack">
          <Sparkles size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} />
          Built with React · Node.js · Express · MongoDB · PaddleOCR · Qwen · TrOCR · Python
        </div>
      </div>
    </footer>
  );
}
