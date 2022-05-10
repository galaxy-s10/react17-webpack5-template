import { memo, useEffect } from 'react';

import style from './index.scss';

const Home = () => {
  useEffect(() => {
    console.log('About页面生命周期mounted');
  }, []);

  return (
    <div className={style.about}>
      <h1>about页面</h1>
      <p>关于我！</p>
    </div>
  );
};

export default memo(Home);
