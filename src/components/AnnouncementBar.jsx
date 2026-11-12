export default function AnnouncementBar() {
  return <div className="announcement">
    <span className="visually-hidden">50% off delivery fees. Delivering across Belgium.</span>
    <img className="announcement-desktop" src="/assets/announcement-desktop.png" alt="" aria-hidden="true" />
    <span className="announcement-mobile" aria-hidden="true">50% off delivery fees <span className="announcement-star">✦</span> Delivering across Belgium</span>
  </div>;
}
