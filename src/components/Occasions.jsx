import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import { RollingLabel, RollingArrow } from './ButtonMotion.jsx';

const occasions = [
  ['Weddings', '/assets/occasion-weddings.png', '/assets/occasion-weddings-mobile.png', 'wedding'],
  ['Birthdays', '/assets/occasion-birthdays.png', '/assets/occasion-birthdays-mobile.png', 'birthday'],
  ['Cupcakes & cookies', '/assets/occasion-cupcakes.png', '/assets/occasion-cupcakes-mobile.png', 'cupcakes'],
  ['Baby & milestones', '/assets/occasion-milestones.png', '/assets/occasion-milestones-mobile.png', 'milestones'],
];

export default function Occasions() {
  return <section className="occasions section-wrap" id="occasions">
    <div className="occasion-heading"><div className="section-eyebrow"><i />Categories</div><DisplayHeading name="occasions">Find your reason to celebrate</DisplayHeading></div>
    <div className="occasion-grid">{occasions.map(([name, image, mobileImage, mood]) => <a href="#cake-curator" className="occasion-card" key={name}>
      <div className="occasion-visual"><SiteImage src={image} mobileSrc={mobileImage} alt={`${name} cake`} className={`occasion-image ${mood}`} /><div className="occasion-cta button button-dark" aria-hidden="true"><RollingLabel>Explore collection</RollingLabel><RollingArrow /></div></div><span>{name}</span>
    </a>)}</div>
  </section>;
}
