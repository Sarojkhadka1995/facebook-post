import React, { FC, useEffect, useState } from 'react';
import { IPages } from '../FacebookSharing/types';
import { getPageFeedList } from './services';
import { toastError } from '@/shared/Toaster';
import { Button } from 'react-bootstrap';

interface IProps {
  pageData: any;
}
const Feedlist: FC<IProps> = ({ pageData }) => {
  const [feedList, setFeedList] = useState<{ data: any[]; paging: string }>({
    data: [],
    paging: '',
  });
  const fetchFeedData = async () => {
    const [response, error] = await getPageFeedList({
      id: pageData?.id,
      page_token: pageData?.access_token,
    });
    if (error) {
      toastError('Unable to fetch page list');
    }
    if (response) {
      setFeedList({
        data: response?.data,
        paging: response?.paging,
      });
    }
  };
  useEffect(() => {
    fetchFeedData();
  }, [pageData]);

  return (
    <>
      <h1>FeedList of {pageData?.name}</h1>
      {feedList?.data?.map((elem: any, index: number) => (
        <React.Fragment key={`${pageData?.name}-${index}`}>
          <span>{elem?.message}</span>
          <Button>View Comment</Button>
        </React.Fragment>
      ))}
    </>
  );
};

export default Feedlist;
