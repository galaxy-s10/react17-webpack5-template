// import { useSelector } from 'react-redux';
import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import style from './index.scss';

// import { RootState } from '@/store';

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

  const customStyle: React.CSSProperties = {
    width: '100px',
    textAlign: 'center',
  };

  return (
    <div>
      <div>
        <Link to="/">点击跳转首页</Link>
      </div>
      <div>
        <Link to="/login">点击跳转login</Link>
      </div>
      <div>
        <Link to="/about">点击跳转about</Link>
      </div>
      <div className={style.myfont}>{title}</div>
      <img src={AuthorJPG} style={customStyle} alt="" />
      <div>redux状态：{JSON.stringify(counter)}</div>
      <button onClick={() => dispatch(addNum(1))}>加一</button>
      <button onClick={() => dispatch(delNum(2))}>减二</button>
    </div>
  );
};

export default memo(Home);
