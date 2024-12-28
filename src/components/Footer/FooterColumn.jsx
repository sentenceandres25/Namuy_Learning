// FooterColumn.jsx
import React from 'react';
import styles from './FooterColumn.module.css';

const FooterColumn = ({ title, links, children }) => (
  <div className={styles.footerColumn}>
    <h4>{title}</h4>
    {links && (
      <ul>
        {links.map((link, index) => (
          <li key={index}><a href={link.href}>{link.text}</a></li>
        ))}
      </ul>
    )}
    {children}
  </div>
);

export default FooterColumn;
