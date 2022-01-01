import { memo, useState, useEffect } from 'react';
import Home from '@/pages/home';
import style from './index.scss';

console.log(style);
const App = () => {
  // 生命周期
  useEffect(() => {}, []);

  return (
    <div>
      <Home></Home>
      <div className={style.aaa}>aaaaaa</div>
      <span className={style.bbb}>bbbb</span>
    </div>
  );
};

export default memo(App);
