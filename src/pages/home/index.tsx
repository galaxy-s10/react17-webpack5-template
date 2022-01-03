import { memo, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { addNum, delNum, ajaxGetUserInfo } from '@/stores/counter';
// import { RootState } from '@/store';

import AuthorJPG from '../../assets/img/author.jpg';
import style from './index.scss';

const Home = () => {
  // const counter = useSelector((state: RootState) => {
  //   console.log(state, 111);
  //   return state.counter;
  // });
  // useAppSelector可以省略RootState
  const counter = useAppSelector((state) => {
    console.log(state, 111);
    return state.counter;
  });

  const dispatch = useAppDispatch();
  // 生命周期
  useEffect(() => {
    console.log('生命周期', counter);
  }, []);

  useEffect(() => {
    console.log(dispatch, 22);
    dispatch(ajaxGetUserInfo());
  }, [dispatch]);

  return (
    <div>
      <div>
        <Link to="/login">login</Link>
      </div>
      <div className={style.myfont}>Home页面</div>
      <img src={AuthorJPG} style={{ width: '100px' }} alt="" />

      <div>
        <div>redux状态：{JSON.stringify(counter)}</div>
      </div>
      <button onClick={() => dispatch(addNum(1))}>加一</button>
      <button onClick={() => dispatch(delNum(2))}>减二</button>
    </div>
  );
};

export default memo(Home);
