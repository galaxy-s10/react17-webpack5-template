import { memo, useState, useEffect } from 'react';
import AuthorJPG from '../../assets/img/author.jpg';
import style from './index.scss';

const Home = () => {
  // 生命周期
  useEffect(() => {}, []);

  return (
    <div>
      <div>
        {[1, 2, 3].map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </div>
      <div className={style.myfont}>Home页面</div>
      <img src={AuthorJPG} style={{ width: '50px' }} alt="" />
    </div>
  );
};

export default memo(Home);
