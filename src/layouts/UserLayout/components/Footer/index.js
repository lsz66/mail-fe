import React from 'react';

export default () => {
  const year = new Date().getFullYear();
  return (
    <div style={styles.footer}>
      <div style={styles.links}>
        <a style={styles.link}>
          帮助
        </a>
        <a style={styles.link}>
          隐私
        </a>
        <a style={{ ...styles.link, marginRight: '0' }}>
          条款
        </a>
      </div>
      <br />
      <div style={styles.copyright}>Copyright © 2014 - {year} LSZ Studio. All rights reserved.</div>
    </div>
  );
};

const styles = {
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '20px',
  },
  links: {
    marginBottom: '8px',
  },
  link: {
    fontSize: '13px',
    marginRight: '40px',
    color: '#fff',
  },
  copyright: {
    fontSize: '13px',
    color: '#fff',
    lineHeight: 1.5,
    textAlign: 'right',
  },
};
