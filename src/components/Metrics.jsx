import RollingNumber from './RollingNumber.jsx';

const metrics = [
  ['15+', 'Years of cake artistry', '15'],
  ['2000+', 'Customers around the globe', '2000'],
  ['50,000+', 'Careful cake deliverys', '50000'],
  ['120', 'New cake flavours', '120'],
];

export default function Metrics({ enabled = true }) {
  return <section className="metrics" id="metrics" aria-label="Cake artistry in numbers">
    {metrics.map(([number, label, asset], order) => <div className="metric" key={label}>
      <strong><RollingNumber value={number} asset={asset} enabled={enabled} order={order} /><span className="metric-number-text visually-hidden">{number}</span></strong>
      <span>{label}</span>
    </div>)}
  </section>;
}
