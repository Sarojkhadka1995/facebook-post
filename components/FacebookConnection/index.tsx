import React, { useEffect, useState } from 'react';

import axios from 'axios';

//Config
import { config } from '../../config';

//Components
import { toastError } from '@/shared/Toaster';

interface IProps {
  type: string;
  btnText: string;
  textClass?: string;
  setPageList: (arg0: any) => void;
  logoutTrigger?: boolean;
  setLogoutTrigger?: (arg0: boolean) => void;
}

const FacebookConnection: React.FC<IProps> = ({
  type,
  btnText,
  textClass,
  setPageList,
  logoutTrigger,
  setLogoutTrigger,
}) => {
  let windowWithFB: FacebookWindow | null = null;

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  if (typeof window !== 'undefined') {
    windowWithFB = window as FacebookWindow;
  }

  const handleFacebookLogin = () => {
    // browser code
    if (windowWithFB?.FB) {
      // Disable the button for 30 seconds
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10 * 1000);
      windowWithFB.FB.getLoginStatus(function (response: any) {
        if (response.status === 'connected') {
          // User is logged in
          // Log out the current user
          windowWithFB.FB.logout(function (response: any) {
            // User is logged out
            // Trigger the new login flow
            windowWithFB.FB.login(
              function (response: any) {
                // Handle the response from the new login flow
                if (response.authResponse) {
                  // Access token is available in response.authResponse.accessToken
                  getPagesList(
                    response.authResponse.accessToken,
                    response.authResponse.userID
                  );
                  // Use the access token as needed
                } else {
                  // User cancelled the new login flow
                  toastError('You cancelled login or did not fully authorize.');
                }
              },
              { auth_type: 'reauthenticate', scope: 'email' }
            );
          });
        } else {
          // User is not logged in
          // Trigger the new login flow directly
          windowWithFB.FB.login(
            function (response: any) {
              // Handle the response from the new login flow
              if (response.authResponse) {
                // Access token is available in response.authResponse.accessToken
                getPagesList(
                  response.authResponse.accessToken,
                  response.authResponse.userID
                );
                // Use the access token as needed
              } else {
                // User cancelled the new login flow
                toastError('You cancelled login or did not fully authorize.');
              }
            },
            { auth_type: 'reauthenticate', scope: 'email' }
          );
        }
      });
    }
  };

  const getPagesList = async (token: string, userID: string) => {
    try {
      const url = `https://graph.facebook.com/${userID}/accounts`;
      const longLivedTokenUrl = `https://graph.facebook.com/oauth/access_token`;
      const longLivedTokenParams = {
        grant_type: 'fb_exchange_token',
        client_id: config.facebook.client_id,
        client_secret: config.facebook.secret,
        fb_exchange_token: token,
      };
      const longLivedTokenResponse = await axios.get(longLivedTokenUrl, {
        params: longLivedTokenParams,
      });
      if (longLivedTokenResponse) {
        const params = {
          fields: 'name,access_token,instagram_business_account',
          access_token: longLivedTokenResponse?.data?.access_token,
        };
        const response = await axios.get(url, { params });
        if (response) {
          if (response?.data?.data?.length > 0) {
            if (type === 'instagram') {
              const list = response?.data?.data?.filter((elem: any) =>
                Object.keys(elem).includes('instagram_business_account')
              );
              if (list?.length > 0) {
                localStorage.setItem(
                  'facebookData',
                  JSON.stringify({
                    type,
                    data: list,
                    access_token: longLivedTokenResponse?.data?.access_token,
                  })
                );
                setPageList({
                  type,
                  data: list,
                  access_token: longLivedTokenResponse?.data?.access_token,
                });
              } else {
                toastError(
                  'There are no pages connnected with this account, try again with another account.'
                );
              }
            } else {
              localStorage.setItem(
                'facebookData',
                JSON.stringify({
                  type,
                  data: response?.data?.data,
                  access_token: longLivedTokenResponse?.data?.access_token,
                  userID,
                })
              );
              setPageList({
                type,
                data: response?.data?.data,
                access_token: longLivedTokenResponse?.data?.access_token,
                userID,
              });
            }
          } else {
            toastError(
              'There are no pages connnected with this account, try again with another account.'
            );
          }
        }
      }
    } catch (e) {
      console.log('Error ====', e);
      toastError('Unable to retrive page list');
    }
  };

  useEffect(() => {
    // Load the Facebook SDK asynchronously

    if (windowWithFB) {
      windowWithFB.fbAsyncInit = function () {
        windowWithFB.FB.init({
          appId: config.facebook.client_id,
          cookie: true,
          xfbml: true,
          version: 'v13.0',
          debug: true,
        });
      };
    }

    (function (d, s, id) {
      //   let js: HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // useEffect(() => {
  //   if (logoutTrigger) {
  //     logout();
  //   }
  // }, [logoutTrigger, setLogoutTrigger]);

  return (
    <p
      onClick={handleFacebookLogin}
      className={`${textClass}`}
      style={{ cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }}
    >
      {btnText}
    </p>
  );
};

export default React.memo(FacebookConnection);
