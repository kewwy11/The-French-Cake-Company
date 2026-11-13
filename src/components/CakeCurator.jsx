import { useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import { RollingLabel, RollingArrow } from './ButtonMotion.jsx';
const prompts = [
  { question: 'What are we celebrating?', choices: ['Birthday', 'Wedding', 'Promotion', 'Something else'] },
  { question: 'What’s the vibe?', choices: ['Romantic', 'Playful', 'Elegant', 'Gothic'] },
];
export default function CakeCurator() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const choose = (group, choice) => { setAnswers((current) => ({ ...current, [group]: current[group] === choice ? null : choice })); setSubmitted(false); };
  return <section className="cake-curator section-wrap" id="cake-curator">
    <div className="section-eyebrow curator-mobile-eyebrow"><i />The cake curator</div>
    <div className="curator-content">
      <div className="curator-intro"><div className="section-eyebrow"><i />The cake curator</div>
      <div className="curator-title"><DisplayHeading name="curator">Let’s make your cake.</DisplayHeading><p>A little inspiration is all we need to get started.</p></div></div>
      <div className="curator-options">{prompts.map(({ question, choices }) => <fieldset key={question}>
        <legend>{question}</legend><div className="choice-list">{choices.map((choice) => <button type="button" onClick={() => choose(question, choice)} aria-pressed={answers[question] === choice} className={'choice ' + (answers[question] === choice ? 'chosen' : '')} key={choice}><RollingLabel>{choice}</RollingLabel></button>)}</div>
      </fieldset>)}</div>
      <div className="curator-footer"><p className="curator-note">{submitted ? 'Lovely. Your inspiration is ready for the next step.' : 'Your selections will carry through to the full cake design journey.'}</p>
      <button className="button button-dark curator-submit" onClick={() => setSubmitted(true)}><RollingLabel>Continue to design my cake</RollingLabel><RollingArrow /></button></div>
    </div>
    <SiteImage src="/assets/curator-cakes.png" mobileSrc="/assets/curator-cakes-mobile.png" alt="A selection of hand finished layer cakes" className="curator-photo" />
  </section>;
}
