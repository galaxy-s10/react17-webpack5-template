import { memo, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// import { RootState } from '@/store';

import style from './index.scss';

import AuthorJPG from '@/assets/img/author.jpg';
import { addNum, delNum, ajaxGetUserInfo } from '@/stores/counter';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';

const Home = () => {
  // const counter = useSelector((state: RootState) => {
  //   console.log(state, 111);
  //   return state.counter;
  // });
  // useAppSelector可以省略RootState
  const counter = useAppSelector((state) => state.counter);

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('Home页面Title');

  useEffect(() => {
    console.log('Home生命周期', counter);
  }, []);

  useEffect(() => {
    dispatch(ajaxGetUserInfo());
  }, [dispatch]);

  return (
    <div>
      <Link to="/login">点击跳转login</Link>
      <div className={style.myfont}>{title}</div>
      <img src={AuthorJPG} style={{ width: '100px' }} alt="" />
      <div>redux状态：{JSON.stringify(counter)}</div>
      <button onClick={() => dispatch(addNum(1))}>加一</button>
      <button onClick={() => dispatch(delNum(2))}>减二</button>
    </div>
  );
};

export default memo(Home);
