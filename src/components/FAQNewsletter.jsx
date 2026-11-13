import { useState } from 'react';
import DisplayHeading from './DisplayHeading.jsx';
import { RollingLabel, RollingArrow } from './ButtonMotion.jsx';
const questions = [
  ['How far in advance should I order?', 'For custom celebration cakes, we recommend getting in touch at least two weeks ahead. Wedding cakes are best discussed several months in advance.'],
  ['Do you deliver throughout Belgium?', 'Yes. We deliver across Belgium and will confirm the delivery details when we plan your order.'],
  ['Can I customise flavours and decorations?', 'Absolutely. Every custom cake can be tailored to your flavour preferences, palette and celebration.'],
  ['How far in advance should I order?', 'Send us a note with your date and guest count and we will help you find the right size.'],
];
export default function FAQNewsletter() {
  const [open, setOpen] = useState(-1);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const submit = (event) => { event.preventDefault(); if (email.trim()) setJoined(true); };
  return <section className="faq-newsletter section-wrap" id="faq">
    <div className="faq-block"><div className="section-eyebrow"><i />Good to know</div><DisplayHeading name="faq">A few tasty answers.</DisplayHeading>
      <div className="faq-list">{questions.map(([question, answer], i) => <article className="faq-item" key={question + i}>
        <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><RollingLabel>{question}</RollingLabel><b className="button-symbol">{open === i ? '−' : '+'}</b></button>
        {open === i && <p>{answer}</p>}
      </article>)}</div>
    </div>
    <aside className="newsletter"><div className="section-eyebrow"><i />The sweet list</div><div className="newsletter-body"><div className="newsletter-copy"><DisplayHeading name="newsletter">Good things come to those who subscribe.</DisplayHeading><p>A little inspiration, first looks at new creations and occasional sweet surprises. No spam, just cake.</p></div>
      <form onSubmit={submit}><label className="visually-hidden" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required /><button className="button button-light" type="submit"><RollingLabel>{joined ? 'You’re on the list' : 'Join the sweet list'}</RollingLabel><RollingArrow dark /></button></form>
    </div></aside>
  </section>;
}
