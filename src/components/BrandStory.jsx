export default function BrandStory() {
  return <section className="brand-story section-wrap" id="our-story">
    <div className="section-eyebrow about-label"><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet="/assets/about-marker-mobile.svg" /><img src="/assets/about-marker.svg" alt="" /></picture><img className="about-desktop-title" src="/assets/about-title-desktop.png" alt="" aria-hidden="true" /><span className="about-mobile-title" aria-hidden="true">About us</span><span className="visually-hidden">About us</span></div>
    <div className="story-copy"><p className="story-lead">Born from a love of beautiful things, and butter.</p><p>The French Cake Company was built on a single belief: that a cake isn't just a dessert it's the centrepiece of your most cherished moments. Based in Braine-le-Château, our atelier is where traditional French pastry techniques meet bold, modern artistry.</p></div>
  </section>;
}
