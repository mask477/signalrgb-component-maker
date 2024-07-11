import { ChangeEventHandler } from 'react';
import { Form } from 'react-bootstrap';

export type FieldType = 'text' | 'number' | 'file';

interface FieldPropTypes {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  width?: string;
  value?: any;
  onChange: ChangeEventHandler;
}

export default function Field({
  name,
  label,
  placeholder,
  type = 'text',
  width = 'col-md-6',
  value,
  onChange,
}: FieldPropTypes) {
  return (
    <div className={width}>
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          type={type ? type : 'text'}
          value={value}
          required
        />
      </Form.Group>
    </div>
  );
}
