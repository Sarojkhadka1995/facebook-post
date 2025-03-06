import React, { FC, useEffect, useState } from 'react';

import { RiArrowGoBackLine } from 'react-icons/ri';
import { getComments, getPageFeedList } from './services';
import { toastError } from '@/shared/Toaster';
import { Button, Spinner } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

interface IProps {
  pageData: any;
  goBack: () => void;
}
const Feedlist: FC<IProps> = ({ pageData, goBack }) => {
  const [feedList, setFeedList] = useState<{ data: any[]; paging: string }>({
    data: [],
    paging: '',
  });

  const [feedlistLoading, setFeedlistLoading] = useState<boolean>(false);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentList, setCommentList] = useState<any>(null);
  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    null
  );

  const fetchFeedData = async () => {
    setFeedlistLoading(true);
    const [response, error] = await getPageFeedList({
      id: pageData?.id,
      page_token: pageData?.access_token,
    });
    setFeedlistLoading(false);
    if (error) {
      toastError('Unable to fetch page list');
      return;
    }
    if (response) {
      setFeedList({
        data: response?.data,
        paging: response?.paging,
      });
    }
  };

  const accordianClick = (feedId: string, index: string) => {
    if (activeAccordionKey === index) {
      setActiveAccordionKey(null);
    } else {
      setActiveAccordionKey(index.toString());
      fetchComment(feedId, index);
    }
  };

  const fetchComment = async (postId: string, index: string) => {
    setCommentLoading(true);

    const [response, error] = await getComments(postId, pageData?.access_token);
    setCommentLoading(false);
    if (error) {
      toastError('Unable to retrieve comments');
      return;
    }
    if (response) {
      // setCommentList([
      //   ...commentList.slice(0, index),
      //   response,
      //   ...commentList.slice(index + 1),
      // ]);
      setCommentList({
        data: response?.data,
        paging: response?.paging,
      });
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [pageData]);

  return (
    <div className={`feedlist`}>
      <Button onClick={goBack} className="mb-4" variant="info">
        Go Back <RiArrowGoBackLine />
      </Button>
      <h2 className="mb-4">FeedList of {pageData?.name}</h2>
      {feedlistLoading ? (
        <Spinner className="mx-auto d-block" />
      ) : (
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
                        variant={`${
                          activeAccordionKey === index.toString()
                            ? 'secondary'
                            : 'success'
                        }`}
                        onClick={() =>
                          accordianClick(elem.id, index.toString())
                        }
                      >
                        {activeAccordionKey === index.toString()
                          ? 'Hide'
                          : 'View'}{' '}
                        Comment
                      </Button>
                    </Card.Header>
                    <Accordion.Collapse eventKey={index.toString()}>
                      <Card.Body>
                        {commentLoading ? (
                          <Spinner className="mx-auto d-block" />
                        ) : (
                          <ul>
                            {commentList !== null &&
                            commentList?.data?.length > 0 ? (
                              commentList?.data?.map(
                                (comment: any, commentIndex: number) => (
                                  <li
                                    key={`comment-${index}-${commentIndex}`}
                                    className="li-dot"
                                  >
                                    {`${comment.message}. ${comment.created_time}`}
                                  </li>
                                )
                              )
                            ) : (
                              <li>No comments</li>
                            )}
                          </ul>
                        )}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                )}
              </React.Fragment>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default Feedlist;
