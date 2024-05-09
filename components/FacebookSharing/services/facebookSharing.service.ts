import { IHttp } from '@/types/http.interface';
import { IDataToPost, IPages } from '../types/index';
import axios from 'axios';
import fs from 'fs';

// export const postFacebook = async (
//   payload: IDataToPost,
//   file: File // Assuming the file is passed as a second argument
// ): Promise<[IHttp<{ data: any }>, any]> => {
//   const formData = new FormData();
//   formData.append('user_id', payload.user_id);
//   formData.append('access_token', payload.access_token);
//   if (payload?.text) {
//     formData.append('text', payload.text);
//   }
//   payload.pages.forEach((page) => {
//     formData.append('pages[]', JSON.stringify(page));
//   });
//   if (file) {
//     formData.append('image', file);
//   }

//   try {
//     const response = await axios.post('/reviews/review-sharing', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     if (response.status === 201) {
//       return [response, null];
//     } else {
//       throw response;
//     }
//   } catch (error) {
//     return [null, error];
//   }
// };

export const postPhotoAndCaption = async (
  payload: any,
  text: string,
  photoFilePath: any
) => {
  try {
    const formData = new FormData();

    if (text) {
      formData.append('message', text);
    }

    formData.append('access_token', payload?.page_token);
    formData.append('source', photoFilePath);
    if (payload?.text) {
      formData.append('text', payload.text);
    }

    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${payload?.id}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.status === 200) {
      return [response, null];
    } else {
      throw response;
    }
  } catch (error) {
    console.error('Error uploading photo:');
    return [null, error];
  }
};

export const postTextOnly = async (payload: IPages, text: string) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${payload?.id}/feed?message=${text}&access_token=${payload?.page_token}`
    );
    if (response.status === 200) {
      return [response, null];
    } else {
      throw response;
    }
  } catch (error) {
    console.error('Error uploading photo:');
    return [null, error];
  }
};
