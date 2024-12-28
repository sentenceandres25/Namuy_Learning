// Components/PersonalCenter/CollapsibleSection.jsx

import React, { useState } from 'react';
import { ListGroup, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import styles from './CollapsibleSection.module.css';

const CollapsibleSection = ({ title, icon, items, lang }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListGroup.Item
        action
        onClick={() => setOpen(!open)}
        aria-controls={`collapse-${title}`}
        aria-expanded={open}
        className={styles.listGroupItem}
      >
        <FontAwesomeIcon icon={icon} className={styles.itemIcon} />
        <span>{title}</span>
        <span className={styles.toggleIcon}>{open ? '-' : '+'}</span>
      </ListGroup.Item>
      <Collapse in={open}>
        <div id={`collapse-${title}`} className={styles.submenu}>
          {items.map((item, index) => (
            <Link
              key={index}
              to={`/user/${item.link}/${lang}`}
              className={`list-group-item list-group-item-action ${styles.submenuItem}`}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.itemIcon} />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </Collapse>
    </>
  );
};

export default CollapsibleSection;
