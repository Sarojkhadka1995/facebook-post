import { IPages } from '@/components/FacebookSharing/types';
import axios from 'axios';

export const getPageFeedList = async (payload: IPages) => {
  try {
    debugger;
    const response = await axios.get(
      `https://graph.facebook.com/${payload?.id}/feed?access_token=${payload?.page_token}&limit=25`
    );
    if (response.status === 200) {
      return [response?.data, null];
    } else {
      throw response;
    }
  } catch (error) {
    console.error('Error Fetching Feed');
    return [null, error];
  }
};
