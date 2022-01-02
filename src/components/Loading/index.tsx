import { memo, useState, useEffect } from 'react';

const Loading = () => {
  // 生命周期
  useEffect(() => {
    alert('loading...');
  }, []);

  return <div>Loading...</div>;
};

export default memo(Loading);
