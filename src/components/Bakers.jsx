import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
const bakers = [
  ['/assets/baker-one.png', '/assets/baker-one-mobile.png', 'The pastry chef at work', 'Pastry chef'],
  ['/assets/baker-two.png', undefined, 'A member of our atelier team', 'Our atelier team'],
  ['/assets/baker-three.png', undefined, 'A baker decorating a cake', 'Cake artist'],
  ['/assets/baker-four.png', undefined, 'A baker in the atelier', 'Cake artist'],
];
export default function Bakers() {
  return <section className="bakers section-wrap">
    <div className="bakers-heading"><div className="section-eyebrow"><i />Meet our bakers</div><DisplayHeading name="bakers">A little artistry, a lot of heart</DisplayHeading></div>
    <div className="baker-gallery"><div className="baker-track">{[...bakers, ...bakers].map(([image, mobileImage, alt, caption], index) => <article className="baker-card" key={image + index} aria-hidden={index >= bakers.length}><SiteImage src={image} mobileSrc={mobileImage} alt={index >= bakers.length ? '' : alt} /><p>{caption}</p></article>)}</div></div>
  </section>;
}
