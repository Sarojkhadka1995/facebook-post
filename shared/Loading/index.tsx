import React, { FC } from 'react';
import { Spinner } from 'react-bootstrap';

import styles from './loading.module.scss';

interface IProps {
  customClassName?: string;
}
const Loading: FC<IProps> = ({ customClassName }) => {
  return (
    <div className={`${styles.loading} ${customClassName}`}>
      <div className={`${styles.loading_inner}`}>
        <Spinner animation="border" role="status"></Spinner>
      </div>
    </div>
  );
};
export default Loading;
