import React, { FC, useEffect, useState } from "react";
import { IPages } from "../FacebookSharing/types";
import { getPageFeedList } from "./services";
import { toastError } from "@/shared/Toaster";
import { Button } from "react-bootstrap";
import styles from "./feedlist.module.scss";
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
  );

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}
interface IProps {
  pageData: any;
}
const Feedlist: FC<IProps> = ({ pageData }) => {
  const [feedList, setFeedList] = useState<{ data: any[]; paging: string }>({
    data: [],
    paging: "",
  });
  const fetchFeedData = async () => {
    const [response, error] = await getPageFeedList({
      id: pageData?.id,
      page_token: pageData?.access_token,
    });
    if (error) {
      toastError("Unable to fetch page list");
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
    <div className={`feedlist`}>
      <h2 className="mb-4">FeedList of {pageData?.name}</h2>
      {/* {feedList?.data?.map((elem: any, index: number) => (
        <React.Fragment key={`${pageData?.name}-${index}`}>
          <span>{elem?.message}</span>
          <Button>View Comment</Button>
        </React.Fragment>
      ))} */}
      <div className={`feedlist_item`}>
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <h5>title</h5>
              <CustomToggle eventKey="0">Click me!</CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <ul>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <h5>title</h5>
              <CustomToggle eventKey="1">Click me!</CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <ul>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <h5>title</h5>
              <CustomToggle eventKey="2">Click me!</CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <ul>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                  <li>This is a comment</li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
};

export default Feedlist;
