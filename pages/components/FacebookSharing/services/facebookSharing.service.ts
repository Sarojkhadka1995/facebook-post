import { IHttp } from '@/types/http.interface';
import { IDataToPost } from './../types/index';
import axios from 'axios';

export const postFacebook = async (
  payload: IDataToPost,
  file: File // Assuming the file is passed as a second argument
): Promise<[IHttp<{ data: any }>, any]> => {
  const formData = new FormData();
  formData.append('user_id', payload.user_id);
  formData.append('access_token', payload.access_token);
  if (payload?.text) {
    formData.append('text', payload.text);
  }
  payload.pages.forEach((page) => {
    formData.append('pages[]', JSON.stringify(page));
  });
  if (file) {
    formData.append('image', file);
  }

  try {
    const response = await axios.post('/reviews/review-sharing', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 201) {
      return [response, null];
    } else {
      throw response;
    }
  } catch (error) {
    return [null, error];
  }
};
