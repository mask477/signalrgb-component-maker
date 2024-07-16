import React, {
  ChangeEvent,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';
import { Shape, useComponent } from '../context/ComponentContext';
import GridRowItem from './GridRowItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightArrowLeft,
  faArrowRotateLeft,
  faArrowRotateRight,
  faDrawPolygon,
  faEraser,
} from '@fortawesome/free-solid-svg-icons';
import ThresholdInput from './ThresholdInput';
import GridControlButton from './GridControlButton';
import Field from './Field';
import {
  DimensionsType,
  scaleVertices4,
  sortVerticesClockwise,
  traceImage,
  VertexType,
} from '../utils/Functions';

export default function Grid() {
  const {
    component,
    grid,
    LedsUsed,
    gridAction,
    shape,
    shapeImage,
    setShapeImage,
    mapVertices,
  } = useComponent();
  const { Width, Height, LedCount } = component;

  const [allVertices, setAllVertices] = useState<VertexType[]>([]);
  const [scaledVertices, setScaledVertices] = useState<VertexType[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verticesCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawWidth = Width * 10;
    const drawHeight = Height * 10;

    if (canvasRef.current) {
      canvasRef.current.width = drawWidth;
      canvasRef.current.height = drawHeight;
      const ctx = canvasRef.current.getContext('2d');

      ctx?.drawImage(shapeImage, 0, 0, drawWidth, drawHeight);
    }
    if (verticesCanvasRef.current) {
      verticesCanvasRef.current.width = drawWidth;
      verticesCanvasRef.current.height = drawHeight;
    }
  }, [shapeImage, canvasRef, Width, Height]);

  const onClickActionHandler = (action: string) => gridAction(action);

  const onChangeShapeImageHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const file: File = event.target.files[0];

        if (file) {
          const reader = new FileReader();
          reader.onload = function (readerEvent) {
            if (readerEvent.target) {
              if (typeof readerEvent.target.result === 'string') {
                let image = new Image();
                image.src = readerEvent.target.result;

                setShapeImage(image);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setShapeImage]
  );

  useEffect(() => {
    console.log('allVertices.length:', allVertices.length);

    if (allVertices.length && canvasRef.current) {
      const canvas = canvasRef.current;

      setScaledVertices(
        scaleVertices4(
          allVertices,
          canvas.width,
          canvas.height,
          Width,
          Height,
          LedCount
        )
      );
      drawOnCanvas(verticesCanvasRef, allVertices);
    }
  }, [Height, LedCount, Width, allVertices]);

  useEffect(() => {
    console.log('scaledVertices:', scaledVertices);

    if (scaledVertices.length) {
      drawOnCanvas(resultCanvasRef, scaledVertices, 10);
      mapVertices(scaledVertices);
    }
  }, [scaledVertices]);

  const drawOnCanvas = (
    canvasRef: RefObject<HTMLCanvasElement>,
    vertices: VertexType[],
    ledSize: number = 1
  ) => {
    if (!canvasRef) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      context.lineTo(vertices[i].x, vertices[i].y);
    }
    context.stroke();
    context.closePath();

    for (let i = 0; i < vertices.length; i++) {
      context.beginPath();
      context.arc(vertices[i].x, vertices[i].y, 2, 0, 2 * Math.PI);
      context.fillStyle = 'red';
      context.fill();
      context.closePath();
    }
  };

  const onClickTrace = useCallback(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    setAllVertices(traceImage(shapeImage, canvas));
  }, [setAllVertices, shapeImage]);

  return (
    <>
      <h4>LED Mapping:</h4>
      <div className="card mb-3">
        <div className="card-body">
          <Alert variant="light">
            <ul>
              <li>
                <b>Usage:</b>
                <ul>
                  <li>Use arrow keys to navigate</li>
                  <li>
                    Enter the led number in the circle to map an led on the
                    desired coordinate.
                  </li>
                  <li>
                    <span
                      style={{
                        background: 'gray',
                        color: 'black',
                        paddingInline: 3,
                      }}
                    >
                      Gray
                    </span>
                    : No led has been mapped.
                  </li>
                  <li>
                    <span
                      style={{
                        background: 'yellowgreen',
                        color: 'black',
                        paddingInline: 3,
                      }}
                    >
                      Green
                    </span>
                    : The mapping is correct and the desired input led wil be
                    mapped to that coordinate.
                  </li>
                  <li>
                    <span
                      style={{
                        background: 'red',
                        color: 'black',
                        paddingInline: 3,
                      }}
                    >
                      Red
                    </span>
                    : There are redundent led number mapping.
                  </li>
                </ul>
              </li>
              <li>
                <b>LEDs used:</b> {LedsUsed}
              </li>
            </ul>
          </Alert>

          <div className="row justify-content-center">
            <div className="grid mb-4">
              {grid.map((items, idx) => (
                <div className="grid-row" key={`row-${idx}`}>
                  {items.map((item, itemIdx) => (
                    <GridRowItem key={`item-${itemIdx}`} item={item} />
                  ))}
                </div>
              ))}
            </div>

            {shape === Shape.Custom && (
              <div className="row justify-content-center mb-4">
                <div className="col-md-6 col-sm-12">
                  <div>
                    <Field
                      name="image"
                      label="Shape Image"
                      placeholder="Upload shape Image"
                      type="file"
                      onChange={onChangeShapeImageHandler}
                    />
                  </div>
                  <div>
                    <canvas
                      ref={canvasRef}
                      className="border"
                      width="200"
                      height="200"
                    ></canvas>
                    <canvas
                      ref={verticesCanvasRef}
                      className="border"
                      width="200"
                      height="200"
                    ></canvas>

                    <canvas
                      ref={resultCanvasRef}
                      className="border"
                      width="200"
                      height="200"
                    ></canvas>
                  </div>
                  <Button onClick={onClickTrace}>Trace</Button>
                </div>
              </div>
            )}

            <div className="shape-controls">
              <div>
                <ButtonGroup>
                  <Button
                    onClick={() => onClickActionHandler(Shape.Circle)}
                    variant={shape === Shape.Circle ? 'primary' : 'secondary'}
                  >
                    <FontAwesomeIcon icon={faCircle} />
                  </Button>
                  <Button
                    onClick={() => onClickActionHandler(Shape.Square)}
                    variant={shape === Shape.Square ? 'primary' : 'secondary'}
                  >
                    <FontAwesomeIcon icon={faSquare} />
                  </Button>
                  <Button
                    onClick={() => onClickActionHandler(Shape.Custom)}
                    variant={shape === Shape.Custom ? 'primary' : 'secondary'}
                  >
                    <FontAwesomeIcon icon={faDrawPolygon} />
                  </Button>
                </ButtonGroup>
                <GridControlButton
                  onClick={() => onClickActionHandler('clear')}
                  toolTipText="Clear the grid mappings"
                  icon={faEraser}
                />
              </div>

              <div>
                {shape === Shape.Circle && <ThresholdInput />}
                <ButtonGroup>
                  <GridControlButton
                    onClick={() => onClickActionHandler('clockwise')}
                    toolTipText="Shift Leds Clockwise"
                    icon={faArrowRotateLeft}
                  />
                  <GridControlButton
                    onClick={() => onClickActionHandler('anti-clockwise')}
                    toolTipText="Shift Leds Anti-Clockwise"
                    icon={faArrowRotateRight}
                  />
                  <GridControlButton
                    onClick={() => onClickActionHandler('reverse')}
                    toolTipText="Reverse the direction of the led sequence"
                    icon={faArrowRightArrowLeft}
                  />
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
