import { memo } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <div>404</div>
    <Link to="/">goHome</Link>
  </div>
);

export default memo(NotFound);
