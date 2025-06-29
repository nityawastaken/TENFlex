import React from 'react'
import '@/app/gigDetails/Breadcrumbs.css';

function Breadcrumbs() {
  const paths = [
    { name: 'Home', link: '#' },
    { name: 'Programming & Tech', link: '#' },
    { name: 'Website Development', link: '#' },
    { name: 'Custom Websites', link: '#' },
  ];

  return (
    <div className="breadcrumbs-container">
      <div className="content-wrapper">
        <ul className="breadcrumbs-list">
          {paths.map((path, index) => (
            <li key={index} className="breadcrumb-item">
              <a href={path.link} className="breadcrumb-link">{path.name}</a>
              {index < paths.length - 1 && <span className="breadcrumb-separator">/</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Breadcrumbs;