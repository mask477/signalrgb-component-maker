import React, { ChangeEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { getBase64 } from '../utils/Functions';
import { useComponent } from '../context/ComponentContext';

export default function ImageUpload() {
  const { setImage } = useComponent();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      setImage('');
      return;
    }

    getBase64(selectedFile)
      .then((base64: string) => {
        setImage(base64.split(',')[1]);
      })
      .catch((error) => {
        console.error(error);
        setImage('');
      });

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  return (
    <>
      <h4>Component Image:</h4>
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-12 d-flex flex-column justify-content-center align-items-center">
              <div className="image-container mb-4">
                {selectedFile ? (
                  <img src={preview} alt="Choose Image" />
                ) : (
                  <small>Choose an Image</small>
                )}
              </div>
              <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Control
                  type="file"
                  onChange={onSelectFile}
                  size="lg"
                  accept="image/png, image/jpeg"
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
