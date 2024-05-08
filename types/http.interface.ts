import { AxiosResponse } from 'axios';

export interface IHttpRes<T> extends AxiosResponse {
  data: T;
}

export interface IHttpResWithData<T> extends AxiosResponse {
  data: {
    data: T;
    perPage: number;
    total: number;
  };
}

export type IHttp<T> = IHttpRes<T> | null;
