import { useCallback, useState } from 'react';
import OpeningSequence from './components/OpeningSequence.jsx';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Hero from './components/Hero.jsx';
import Metrics from './components/Metrics.jsx';
import BestSellers from './components/BestSellers.jsx';
import BrandStory from './components/BrandStory.jsx';
import Occasions from './components/Occasions.jsx';
import CakeCurator from './components/CakeCurator.jsx';
import Services from './components/Services.jsx';
import Testimonial from './components/Testimonial.jsx';
import Bakers from './components/Bakers.jsx';
import FAQNewsletter from './components/FAQNewsletter.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [ready, setReady] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const completeIntro = useCallback(() => setReady(true), []);
  return <>
    {!ready && <OpeningSequence onComplete={completeIntro} />}
    <div className="page-shell" inert={!ready} aria-hidden={!ready}>
    <AnnouncementBar /><Hero isRevealed={ready} />
    <main>
      <Metrics enabled={ready} /><BestSellers /><BrandStory /><Occasions /><CakeCurator />
      <Services /><Testimonial /><Bakers /><FAQNewsletter />
    </main>
    <Footer />
    </div>
  </>;
}