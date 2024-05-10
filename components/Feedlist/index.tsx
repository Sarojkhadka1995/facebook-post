import React, { FC, useEffect, useState } from 'react';
import { IPages } from '../FacebookSharing/types';
import { getComments, getPageFeedList } from './services';
import { toastError } from '@/shared/Toaster';
import { Button } from 'react-bootstrap';
import styles from './feedlist.module.scss';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';

interface IProps {
  pageData: any;
}
const Feedlist: FC<IProps> = ({ pageData }) => {
  const [feedList, setFeedList] = useState<{ data: any[]; paging: string }>({
    data: [],
    paging: '',
  });

  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentList, setCommentList] = useState<any>([]);
  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    null
  );

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

  const fetchComment = async (postId: string, index: number) => {
    setCommentLoading(true);
    const [response, error] = await getComments(postId, pageData?.access_token);
    setCommentLoading(false);
    if (error) {
      toastError('Unable to retrieve comments');
      return;
    }
    if (response) {
      setCommentList([
        ...commentList.slice(0, index),
        response,
        ...commentList.slice(index + 1),
      ]);
      setActiveAccordionKey(index.toString());
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [pageData]);

  return (
    <div className={`feedlist`}>
      <h2 className="mb-4">FeedList of {pageData?.name}</h2>
      <div className={`feedlist_item`}>
        <Accordion activeKey={activeAccordionKey}>
          {feedList?.data?.map((elem: any, index: number) => (
            <React.Fragment key={`${pageData?.name}-${index}`}>
              {elem?.message && (
                <Card>
                  <Card.Header>
                    <h5>{elem?.message}</h5>
                    <Button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => fetchComment(elem.id, index)}
                    >
                      View Comment
                    </Button>
                  </Card.Header>
                  <Accordion.Collapse eventKey={index.toString()}>
                    <Card.Body>
                      <ul>
                        {commentList?.length > 0 ? (
                          commentList[index]?.data?.map(
                            (comment: any, commentIndex: number) => (
                              <li key={`comment-${index}-${commentIndex}`}>
                                {`${comment.message} . ${comment.created_time}`}
                              </li>
                            )
                          )
                        ) : (
                          <li>No comments</li>
                        )}
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              )}
            </React.Fragment>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Feedlist;
