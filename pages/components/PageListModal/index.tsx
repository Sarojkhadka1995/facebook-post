import { FC, useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { IDataToPost } from '../FacebookSharing/types';

interface IProps {
  showPageList: boolean;
  handleClose: () => void;
  pageList: any;
  post: (arg0: IDataToPost) => void;
}
const PageListModal: FC<IProps> = ({
  showPageList,
  handleClose,
  pageList,
  post,
}) => {
  const [selectedPage, setSelectedPage] = useState<any[]>([]);
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

  const postData = () => {
    const dataToPost: IDataToPost = {
      user_id: pageList.userID,
      access_token: pageList.access_token,
      pages: selectedPage,
    };
    post(dataToPost);
  };

  return (
    <Modal show={showPageList} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>Select the page to connect to</Modal.Header>
      <Modal.Body className="p-0 mt-2 mb-2">
        <ListGroup>
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
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="border-0 py-0">
        <Button variant="cancel" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={postData}>
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PageListModal;
