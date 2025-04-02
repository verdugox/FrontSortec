import '../../css/home/footer.css';

export default function Footer() {
  return (
    <footer className="text-light text-center py-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
      <p className="mb-2 mb-md-0">© SORTEC 2025 - Todos los derechos reservados.</p>
      <div className="d-flex align-items-center social-container">
        <a href="https://www.facebook.com/profile.php?id=61571509086893" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src="/images/facebook.png" alt="Facebook" />
        </a>
        <a href="https://m.me/559373170586306" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src="/images/mensajero2.png" alt="Messenger" />
        </a>
        <img src="/images/qrcode.jpeg" alt="QR Code" className="qr-code" />
      </div>
    </footer>
  );
}

  