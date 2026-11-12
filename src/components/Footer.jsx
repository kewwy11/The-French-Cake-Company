import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
const explore = ['Cakes', 'Custom orders', 'Wedding cakes', 'Birthdays', 'Corporate cake'];
const information = ['Our story', 'FAQ', 'Delivery', 'Contact'];
export default function Footer() {
  return <footer className="site-footer">
    <SiteImage src="/assets/footer-cakes.png" mobileSrc="/assets/footer-cakes-mobile.png" alt="Layer cakes on stands in the atelier" className="footer-photo" />
    <div className="footer-main">
      <div className="footer-brand"><a className="footer-wordmark" href="#top"><DisplayHeading as="span" name="footer">The French Cake Company</DisplayHeading></a><p>Extraordinary cakes for life’s<br />sweetest moments.</p></div>
      <div className="footer-links"><div className="footer-column"><h3>Explore</h3>{explore.map((item) => <a href="#occasions" key={item}>{item}</a>)}</div>
      <div className="footer-column"><h3>Information</h3>{information.map((item) => <a href={item === 'FAQ' ? '#faq' : '#our-story'} key={item}>{item}</a>)}</div>
      <div className="footer-column footer-contact"><h3>Get in touch</h3><a href="#instagram">Instagram</a><a href="#facebook">Facebook</a><a href="#contact">Email</a></div></div>
    </div>
    <div className="footer-bottom"><span>© The French Cake Company · Concept redesign by Des1gn Princess</span><span>Made for the moments that matter ✦</span><span className="footer-language">🇧🇪 &nbsp; EN</span></div>
  </footer>;
}
