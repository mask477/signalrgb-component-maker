import { ChangeEventHandler } from 'react';
import { Form } from 'react-bootstrap';

export default function Field({
  name,
  label,
  placeholder,
  type = 'text',
  width = 'col-md-6',
  onChange,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  width?: string;
  onChange: ChangeEventHandler;
}) {
  return (
    <div className={width}>
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          type={type ? type : 'text'}
        />
      </Form.Group>
    </div>
  );
}
