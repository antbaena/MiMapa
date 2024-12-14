import React from "react";

const Footer = () => {
  return (
    <footer
      id="sticky-footer"
      className="flex-shrink-0 py-4 bg-dark text-white-50"
    >
      <div className="container text-center">
        <small>
          &copy; {new Date().getFullYear()} Antonio Cañete Baena - MiMapa. All
          rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
