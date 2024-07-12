import React, { ChangeEvent, useCallback, useEffect, useRef } from 'react';
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
  scaleVertices,
  sortVerticesClockwise,
  transformVertices,
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvas3Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawWidth = Width * 10;
    const drawHeight = Height * 10;

    if (canvasRef.current) {
      canvasRef.current.width = drawWidth;
      canvasRef.current.height = drawHeight;
      const ctx = canvasRef.current.getContext('2d');

      ctx?.drawImage(shapeImage, 0, 0, drawWidth, drawHeight);
    }
    if (canvas2Ref.current) {
      canvas2Ref.current.width = drawWidth;
      canvas2Ref.current.height = drawHeight;
    }
  }, [shapeImage, canvasRef, canvas2Ref, Width, Height]);

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
    [canvasRef, canvas2Ref]
  );

  const onClickTrace = useCallback(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const image = shapeImage;

    const cv = window.cv;

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const edges = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(gray, edges, 100, 200, 3, false);

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redraw resized image

    let allVertices = [];
    for (let i = 0; i < contours.size(); ++i) {
      const contour = contours.get(i);
      for (let j = 0; j < contour.data32S.length; j += 2) {
        allVertices.push({ x: contour.data32S[j], y: contour.data32S[j + 1] });
      }
    }

    allVertices = sortVerticesClockwise(allVertices);

    let equallyDistantVertices = scaleVertices(
      allVertices,
      Width,
      Height,
      LedCount
    );

    // let equallyDistantVertices = transformVertices(
    //   allVertices,
    //   {
    //     width: canvasRef.current.width,
    //     height: canvasRef.current.height,
    //   },
    //   {
    //     width: Width,
    //     height: Height,
    //   },
    //   LedCount
    // );

    drawCanvas2(allVertices);
    drawCanvas3(equallyDistantVertices);

    console.log('equallyDistantVertices:', equallyDistantVertices);

    mapVertices(equallyDistantVertices);

    src.delete();
    gray.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }, [Height, LedCount, Width, shapeImage]);

  const drawCanvas2 = (vertices: VertexType[]) => {
    const canvas2 = canvas2Ref.current;

    if (!canvas2) {
      return;
    }

    const context = canvas2.getContext('2d');

    if (!context) {
      return;
    }
    context.clearRect(0, 0, canvas2.width, canvas2.height);

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

  const drawCanvas3 = (vertices: VertexType[]) => {
    const canvas3 = canvas3Ref.current;

    if (!canvas3) {
      return;
    }
    const context = canvas3.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas3.width, canvas3.height);

    for (let y = 0; y < Height; y++) {
      for (let x = 0; x < Width; x++) {
        const drawAtX = 10 * x;
        const drawAtY = 10 * y;

        const shouldFill = vertices.find(
          (vertex) => Math.floor(vertex.x) === x && Math.floor(vertex.y) === y
        );

        context.beginPath();
        if (shouldFill) {
          context.fillStyle = 'red';
          context.fillRect(drawAtX, drawAtY, 10, 10);
        } else {
          context.rect(drawAtX, drawAtY, 10, 10);
        }

        context.stroke();
        context.closePath();
      }
    }
  };

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
                      ref={canvas2Ref}
                      className="border"
                      width="200"
                      height="200"
                    ></canvas>

                    <canvas
                      ref={canvas3Ref}
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
