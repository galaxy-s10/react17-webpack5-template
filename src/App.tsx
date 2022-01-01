import { memo, useState, useEffect } from 'react';
import HssBtn from '@/components/HssButton';
import style from './index.scss';

console.log(style);
const App = () => {
  const [num, setNum] = useState(1);
  // 生命周期
  useEffect(() => {}, []);

  return (
    <div>
      <HssBtn></HssBtn>
      {num}
      <div className={style.aaa}>aaaaaa</div>
      <span className={style.bbb}>bbbb</span>
    </div>
  );
};

export default memo(App);
