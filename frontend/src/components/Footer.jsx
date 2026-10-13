import React from "react";
import { Sparkles } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="siteFooter" id="about">
      <div className="footerTop">
        <div className="footerBrand">
          <Logo />
          <p>
            AI-powered evaluation for handwritten answer sheets — OCR
            extraction, automated scoring, and transparent feedback for
            teachers and students.
          </p>
        </div>

        <div className="footerCol footerContact">
          <h4>Contact</h4>
          <p className="footerName">
            Designed by <strong>Aniket Majumdar</strong>
          </p>
          <a href="mailto:aniketmajumdar2006@gmail.com" className="footerEmail">
            aniketmajumdar2006@gmail.com
          </a>
          <p className="footerNote">for questions, bugs, or feedback</p>
        </div>
      </div>

      <div className="footerBottom">
        <span className="copyright">© {new Date().getFullYear()} EvalX</span>
        <span className="stack">
          <Sparkles size={12} aria-hidden="true" />
          Built with React · Node.js · Express · MongoDB · PaddleOCR · Qwen · TrOCR · Python
        </span>
      </div>
    </footer>
  );
}
