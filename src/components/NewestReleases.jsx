import BestSellers from './BestSellers.jsx';

const releases = [
  { image: '/assets/newest-one.png', name: 'The colour muse' },
  { image: '/assets/newest-two.png', name: 'The strawberry tower' },
  { image: '/assets/newest-three.png', name: 'The honeycomb cake' },
  { image: '/assets/newest-four.webp', name: 'The rose ripple' },
  { image: '/assets/newest-five.png', name: 'The cupcake collection' },
];

export default function NewestReleases() {
  return <BestSellers items={releases} id="newest-releases" eyebrow="Our newest releases" title="Brand new day, brand new cakes." headingName="newest" mirror initialIndex={releases.length - 1} />;
}
