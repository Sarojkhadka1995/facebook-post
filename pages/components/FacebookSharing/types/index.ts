export interface IDataToPost {
  user_id: string;
  access_token: string;
  pages: IPages[];
  text?: string;
  image?: any | null;
}

interface IPages {
  id: string;
  page_token: string;
}

export interface IPostContent {
  text: string;
  image: any;
}
