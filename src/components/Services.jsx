import { useState } from 'react';
import DisplayHeading from './DisplayHeading.jsx';
const services = [
  { title: 'Wedding design & tasting', asset: 'wedding', detail: 'A personal consultation, flavour tasting and a cake designed around your celebration.' },
  { title: 'Corporate event cakes', asset: 'corporate', detail: 'Thoughtful centrepieces and branded cakes for launches, teams and client events.' },
  { title: 'Birthdays & private parties', asset: 'birthday', detail: 'A custom cake made to make your favourite people feel celebrated.' },
];
export default function Services() {
  const [open, setOpen] = useState(-1);
  return <section className="services section-wrap">
    <div className="services-intro"><div className="section-eyebrow"><i />Our services</div><DisplayHeading name="services">Services we offer</DisplayHeading></div>
    <div className="service-list">{services.map(({ title, asset, detail }, i) => <article className={'service-row ' + (open === i ? 'expanded' : '')} key={title}>
      <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><span className="service-number">0{i + 1}</span><span className="service-title"><span className="visually-hidden">{title}</span><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet={`/assets/service-${asset}-mobile.png`} /><img src={`/assets/service-${asset}-desktop.png`} alt="" /></picture></span><span className="service-action">{open === i ? 'Close' : 'Open'}</span></button>
      {open === i && <p className="service-detail">{detail}</p>}
    </article>)}</div>
  </section>;
}
