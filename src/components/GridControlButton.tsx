import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function GridControlButton({
  onClick,
  toolTipText,
  icon,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  toolTipText: string;
  icon: any;
}) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{toolTipText}</Tooltip>}>
      <Button onClick={onClick}>
        <FontAwesomeIcon icon={icon} />
      </Button>
    </OverlayTrigger>
  );
}
