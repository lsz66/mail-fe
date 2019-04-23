import React from 'react';

export default () => {
  const year = new Date().getFullYear();
  return (
    <div style={styles.footer}>
      <div style={styles.copyright}>
        Copyright © 2014 - {year}&nbsp;
        <a style={{ color: '#fff' }} href="https://szlee.cn">LSZ Studio.</a>&nbsp;
        All rights reserved.
      </div>
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
  copyright: {
    fontSize: '13px',
    color: '#fff',
    lineHeight: 1.5,
    textAlign: 'right',
  },
};
