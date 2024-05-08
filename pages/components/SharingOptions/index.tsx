import React, { FC, Suspense, lazy, useState } from 'react';

// STYLES
import Image from 'next/image';
import { IPostContent } from '../FacebookSharing/types';

interface IProps {
  setPostContent: (arg0: IPostContent) => void;
  postContent: IPostContent;
}
const SharingOptions: FC<IProps> = ({ setPostContent, postContent }) => {
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState({
    error: false,
    message: '',
  });

  const [imageData, setImageData] = useState<any>(null);

  const handleUploadLogoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      validateFileType(e.target.files[0]);
    }
    e.target.value = '';
  };

  const validateFileType = (file: any) => {
    const fileType = file?.type;
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (validImageTypes.some((e) => e === fileType)) {
      validateFileSize(file);
    } else {
      setImageError({
        error: true,
        message: 'Invalid image format',
      });
    }
  };

  const validateFileSize = (file: any) => {
    const fileSize = file?.size;
    if (fileSize > 5242880) {
      setImageError({ error: true, message: 'Image cannot be more than 5MB' });
    } else {
      setImageError({ error: false, message: '' });
      setPostContent({ ...postContent, image: file });
      setImageData(file);
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent({ ...postContent, text: e.target.value });
  };

  return (
    <div>
      <label className="form-label mb-0 me-2">Post text</label>
      <div className="w-100 me-2">
        <input
          type="text"
          className={`form-control`}
          placeholder="Post"
          value={postContent?.text}
          onChange={handleTextInput}
        />
      </div>

      <label>Image</label>
      <input
        type="file"
        accept="image/x-png,image/jpeg"
        onChange={handleUploadLogoChange}
        name="companyInfo-logo-upload-input"
      />
      <div className="image-preview">
        {imageData && (
          <Image
            src={URL.createObjectURL(imageData)}
            alt="Uploaded"
            width={100}
            height={100}
          />
        )}
      </div>
    </div>
  );
};

export default SharingOptions;
