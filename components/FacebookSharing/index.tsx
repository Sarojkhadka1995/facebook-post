import { Button, Form, ListGroup, Spinner } from 'react-bootstrap';
import FacebookConnection from '../FacebookConnection';
import { useEffect, useState } from 'react';
import SharingOptions from '../SharingOptions';
import { IPostContent } from './types';
import {
  postPhotoAndCaption,
  postTextOnly,
} from './services/facebookSharing.service';
import styles from './facebookSharing.module.scss';
import { toastError, toastSuccess } from '@/shared/Toaster';
import Feedlist from '../Feedlist';

const FacebookSharing = () => {
  const [pageList, setPageList] = useState<any>(null);

  const [selectedPage, setSelectedPage] = useState<any[]>([]);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [postContent, setPostContent] = useState<IPostContent>({
    text: '',
    image: null,
  });

  const [showPageFeed, setShowPageFeed] = useState<{
    show: boolean;
    page: any;
  }>({
    show: false,
    page: null,
  });

  //Functions
  const selectPage = (page: any) => {
    setSelectedPage((prev: any[]) => {
      const existingIndex = prev.findIndex((p) => p.id === page.id);
      if (existingIndex !== -1) {
        // If already present, remove it (toggle off)
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Otherwise, add the selected page to the array
        return [
          ...prev,
          { id: page.id, page_token: page.access_token, page_name: page.name },
        ];
      }
    });
  };

  // const postData = async () => {
  //   setIsSaving(true);
  //   selectedPage?.forEach(async (page) => {
  //     let response, error;
  //     if (postContent?.image) {
  //       [response, error] = await postPhotoAndCaption(
  //         page,
  //         postContent?.text,
  //         postContent?.image
  //       );
  //     } else {
  //       [response, error] = await postTextOnly(page, postContent?.text);
  //     }
  //     if (response) {
  //       toastSuccess(`Successfully posted in ${page?.page_name}`);
  //     } else {
  //       toastError(`Failed to post in ${page?.page_name}`);
  //     }
  //   });
  //   setIsSaving(false);
  // };

  const postData = async () => {
    setIsSaving(true);

    for (const page of selectedPage) {
      let response, error;
      if (postContent?.image) {
        [response, error] = await postPhotoAndCaption(
          page,
          postContent?.text,
          postContent?.image
        );
      } else {
        [response, error] = await postTextOnly(page, postContent?.text);
      }

      if (response) {
        toastSuccess(`Successfully posted in ${page?.page_name}`);
        setPostContent({
          text: '',
          image: null,
        });
      } else {
        toastError(`Failed to post in ${page?.page_name}`);
      }
    }

    setIsSaving(false);
  };

  const disconnect = () => {
    setPageList(null);
    localStorage.clear();
  };

  const isPostButtonDisabled = () => {
    return (
      selectedPage.length === 0 ||
      (postContent.text === '' && postContent.image === null)
    );
  };

  const viewPage = (page: any) => {
    setShowPageFeed({ show: true, page: page });
  };

  useEffect(() => {
    const data = localStorage.getItem('facebookData');
    if (pageList === null && data !== null) {
      setPageList(() => JSON.parse(data));
    }
    setSelectedPage([]);
  }, []);

  return (
    <div className={`top_wrapper`}>
      <div>
        <h1 className={`title`}>Facebook Connection</h1>
      </div>
      {pageList?.access_token ? (
        <>
          <button onClick={disconnect} className="btn btn-danger ms-auto">
            Disconnect
          </button>
          {showPageFeed?.show ? (
            <Feedlist
              pageData={showPageFeed?.page}
              goBack={() =>
                setShowPageFeed({
                  show: false,
                  page: null,
                })
              }
            />
          ) : (
            <div className={`share_container`}>
              <div className="row g-3">
                <div className="col-8">
                  <div className={`share_left`}>
                    <SharingOptions
                      setPostContent={setPostContent}
                      postContent={postContent}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className={`share_right`}>
                    <h5>Pages</h5>
                    {pageList?.data?.length > 0 &&
                      pageList?.data?.map((page: any, index: number) => (
                        <ListGroup.Item key={`pageList-${index}`}>
                          <div className="d-flex space-between gap-3 align-items-center mb-3">
                            <Form.Check
                              type={'checkbox'}
                              label={`${page?.name}`}
                              id={`pageList-${index}`}
                              name={'pages'}
                              onChange={() => selectPage(page)}
                            />
                            <Button
                              variant="secondary"
                              className="view-btn"
                              onClick={() => viewPage(page)}
                            >
                              View Feed
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                  </div>
                </div>
              </div>
              <Button
                disabled={isSaving || isPostButtonDisabled()}
                onClick={postData}
                className={`post_btn`}
              >
                Post {isSaving && <Spinner animation="grow" size="sm" />}
              </Button>
            </div>
          )}
        </>
      ) : (
        <FacebookConnection
          type="facebook"
          btnText={'+ Add Facebook Connection'}
          textClass={`btn btn-dark  mb-3 `}
          setPageList={setPageList}
        />
      )}
    </div>
  );
};

export default FacebookSharing;
