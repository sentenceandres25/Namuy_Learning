// SocialIcons.jsx
import React from 'react';
import styles from './SocialIcons.module.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const SocialIcons = () => (
  <div className={styles.socialIcons}>
    <a href="#"><FaFacebookF /></a>
    <a href="#"><FaInstagram /></a>
    <a href="#"><FaTwitter /></a>
    <a href="#"><FaLinkedinIn /></a>
    <a href="#"><FaYoutube /></a>
  </div>
);

export default SocialIcons;
