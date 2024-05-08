import { Button, Form, ListGroup } from 'react-bootstrap';
import FacebookConnection from '../FacebookConnection';
import { useEffect, useState } from 'react';
import SharingOptions from '../SharingOptions';
import { IDataToPost, IPostContent } from './types';
import Loading from '@/pages/shared/Loading';
import { postFacebook } from './services/facebookSharing.service';

const FacebookSharing = () => {
  const [pageList, setPageList] = useState<any>(null);

  const [selectedPage, setSelectedPage] = useState<any[]>([]);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [postContent, setPostContent] = useState<IPostContent>({
    text: '',
    image: null,
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
        return [...prev, { id: page.id, page_token: page.access_token }];
      }
    });
  };

  const postData = async () => {
    const dataToPost: IDataToPost = {
      user_id: pageList.userID,
      access_token: pageList.access_token,
      pages: selectedPage,
      text: postContent?.text,
    };

    setIsSaving(true);
    const [response, error] = await postFacebook(
      dataToPost,
      postContent?.image
    );
    setIsSaving(false);
    if (response) {
    }
    if (error) {
    }
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

  useEffect(() => {
    const data = localStorage.getItem('facebookData');
    if (pageList === null && data !== null) {
      setPageList(() => JSON.parse(data));
    }
  }, []);

  return (
    <>
      <div>
        <span>Facebook connection</span>
      </div>
      {pageList?.access_token ? (
        <>
          <span onClick={disconnect}>Disconnect</span>
          <SharingOptions
            setPostContent={setPostContent}
            postContent={postContent}
          />
          <h2>Pages</h2>
          {pageList?.data?.length > 0 &&
            pageList?.data?.map((page: any, index: number) => (
              <ListGroup.Item key={`pageList-${index}`}>
                <Form.Check
                  type={'checkbox'}
                  label={`${page?.name}`}
                  id={`pageList-${index}`}
                  name={'pages'}
                  onChange={() => selectPage(page)}
                />
              </ListGroup.Item>
            ))}

          <Button
            disabled={isSaving || isPostButtonDisabled()}
            onClick={postData}
          >
            Post {isSaving && <Loading />}
          </Button>
        </>
      ) : (
        <FacebookConnection
          type="facebook"
          btnText={'+ Add Facebook Connection'}
          textClass={`btn btn-dark  mb-3 `}
          setPageList={setPageList}
        />
      )}
    </>
  );
};

export default FacebookSharing;
