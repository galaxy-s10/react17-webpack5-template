import { memo, useEffect } from 'react';

const Loading = () => {
  useEffect(() => {
    console.log('Loading生命周期');
  }, []);
  return <div>Loading...</div>;
};
export default memo(Loading);
