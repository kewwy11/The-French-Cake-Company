import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';

export default function Testimonial() {
  return <section className="testimonial section-wrap">
    <div className="testimonial-heading">
      <div><div className="section-eyebrow"><i />The cake curator</div><DisplayHeading name="testimonial">The proof is in the celebration</DisplayHeading></div>
      <div className="slider-controls"><button className="round-arrow arrow-back" aria-label="Previous story"><img src="/assets/icon-chevron.svg" alt="" /></button><button className="round-arrow" aria-label="Next story"><img src="/assets/icon-chevron.svg" alt="" /></button></div>
    </div>
    <div className="testimonial-content">
      <article className="review-card">
        <div className="review-quote"><img className="quote-mark" src="/assets/testimonial-quote.png" alt="" /><p>Everyone at the party loved the cake! Asides me (the celebrant) it was the most talked about thing. Thank you for making my day!</p></div>
        <div className="reviewer"><SiteImage src="/assets/customer-avatar.png" alt="" className="review-avatar" loading="eager" /><div><b>Rebecca Mikaelsson</b><span>Birthday fiesta</span></div></div>
      </article>
      <SiteImage src="/assets/testimonial-cake.png" mobileSrc="/assets/testimonial-cake-mobile.png" alt="Sculptural floral celebration cake with pink roses" className="testimonial-photo" loading="eager" />
    </div>
  </section>;
}
