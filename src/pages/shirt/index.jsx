import React, { useState, useRef, useEffect } from 'react';
import { colors, hexToRgb, downloadBmp, floodFill, fontOptions } from './utils';
import Layout from 'components/Layout';
import styled from '@emotion/styled';
import { Paper } from 'components/Paper';
import Button from 'components/Buttons';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import Sky from '../../images/sky.png';

const ShirtEditor = () => {
  const [selectedColor, setSelectedColor] = useState(0); // Initial color index
  const [penSize, setPenSize] = useState(10); // Default pen size
  const [selectedTool, setSelectedTool] = useState('pen'); // Current tool: 'pen', 'fill', or 'text'
  const [textContent, setTextContent] = useState(''); // Text to draw
  const [fontSize, setFontSize] = useState(12); // Font size for text
  const [fontFamily, setFontFamily] = useState('Arial'); // Font family for text
  const [history, setHistory] = useState([]); // Canvas history for undo functionality
  const [historyIndex, setHistoryIndex] = useState(-1); // Current position in history
  const canvasRef = useRef(null); // Reference to the canvas for drawing

  // Initialize canvas on component mount
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
    }
  }, []);

  // Save the canvas content as a BMP file
  const saveBMP = () => {
    const canvas = canvasRef.current;
    downloadBmp(canvas);
  };

  // Save current canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const imageData = canvas
      .getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height);

    // Remove any history after current index (when branching from history)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);

    // Limit history to 20 states to prevent memory issues
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  // Initialize canvas with empty state
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Don't save initial empty state to history
  };

  // Clear the canvas
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  // Undo last action
  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const previousState = history[historyIndex - 1];

      ctx.putImageData(previousState, 0, 0);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Handle drawing on the canvas
  const draw = e => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    // Get the selected color
    const color = colors[selectedColor];
    const rgb = hexToRgb(color);

    if (selectedTool === 'pen') {
      // Pen tool - draw with brush
      if (e.type === 'mousedown') {
        saveToHistory(); // Save state before drawing
      }
      ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      ctx.fillRect(x - penSize / 2, y - penSize / 2, penSize, penSize);
      return;
    }
    if (selectedTool === 'fill') {
      // Fill tool - flood fill
      if (e.type === 'mousedown') {
        saveToHistory(); // Save state before drawing
      }
      const imageData = ctx.getImageData(x, y, 1, 1);
      const data = imageData.data;
      const targetColor = [data[0], data[1], data[2], data[3]];
      const fillColor = [rgb[0], rgb[1], rgb[2], 255];
      floodFill(canvas, x, y, targetColor, fillColor);
      return;
    }
    if (selectedTool === 'text' && textContent) {
      // Text tool - draw text
      if (e.type === 'mousedown') {
        saveToHistory(); // Save state before drawing
      }
      ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(textContent, x, y);
      return;
    }
  };

  return (
    <Layout t="Shirt Editor">
      <Paper padding>
        <PaletteContainer>
          {/* Palette: Display 24 colors */}
          {colors.map((color, index) => (
            <ColorSwatch
              key={index}
              onClick={() => setSelectedColor(index)} // Set selected color
              color={color}
              isSelected={selectedColor === index}
            />
          ))}
        </PaletteContainer>

        <p>Selected Color: {colors[selectedColor]}</p>

        {/* Pen Size Controls */}
        <PenControlsContainer>
          <label htmlFor="penSize">Pen Size: </label>
          <input
            type="range"
            id="penSize"
            min="1"
            max="20"
            value={penSize}
            onChange={e => setPenSize(Number(e.target.value))}
          />
          <span>{penSize}</span>
        </PenControlsContainer>

        {selectedTool === 'text' && (
          <PenControlsContainer>
            <label htmlFor="textInput">Text: </label>
            <input
              type="text"
              id="textInput"
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="Enter text to draw"
              style={{ marginRight: '10px' }}
            />
            <label htmlFor="fontFamily">Font: </label>
            <select
              id="fontFamily"
              value={fontFamily}
              onChange={e => setFontFamily(e.target.value)}
              style={{ marginRight: '10px' }}
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            <label htmlFor="fontSize">Size: </label>
            <input
              type="range"
              id="fontSize"
              min="8"
              max="120"
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
            />
            <span>{fontSize}</span>
          </PenControlsContainer>
        )}

        <PenControlsContainer>
          <div>Tool:</div>
          <RadioGroup
            row
            value={selectedTool}
            onChange={e => setSelectedTool(e.target.value)}
          >
            <FormControlLabel value="pen" control={<Radio />} label="Pen" />
            <FormControlLabel value="fill" control={<Radio />} label="Fill" />
            <FormControlLabel value="text" control={<Radio />} label="Text" />
          </RadioGroup>
        </PenControlsContainer>

        <CanvasContainer
          onMouseMove={e => e.buttons === 1 && draw(e)} // Draw when mouse is moving with left button held
          onMouseDown={draw} // Draw when mouse is clicked
        >
          <canvas ref={canvasRef} width="149" height="101" />
        </CanvasContainer>
        <Buttons>
          <Button onClick={saveBMP}>Save Shirt as BMP</Button>
          <Button secondary onClick={undo} disabled={historyIndex <= 0}>
            Undo
          </Button>
          <Button secondary onClick={resetCanvas}>
            Reset
          </Button>
        </Buttons>
      </Paper>
    </Layout>
  );
};

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const PaletteContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const ColorSwatch = styled.div`
  background-color: ${props => props.color};
  width: 30px;
  height: 30px;
  margin: 2px;
  border: ${props => (props.isSelected ? '1px solid #000' : '1px solid #ccc')};
  cursor: pointer;
`;

const CanvasContainer = styled.div`
  border: 1px solid black;
  width: 149px;
  height: 101px;
  position: relative;
  margin-bottom: 10px;
  background-image: url('${Sky}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const PenControlsContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export default ShirtEditor;
