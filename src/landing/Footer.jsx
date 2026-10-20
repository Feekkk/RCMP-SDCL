import logo from '../assets/unikl-official.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div className="footer-brand">
          <img src={logo} alt="UniKL Royal College of Medicine Perak" className="footer-logo" />
          <p>
            Student Development &amp; Campus Lifestyle Department
            <br />
            UniKL Royal College of Medicine Perak
          </p>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} UniKL RCMP. All rights reserved.</p>
      </div>
    </footer>
  )
}
