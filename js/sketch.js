let currentEventIndex = 0;
let animationTime = 0;
let paused = false;
let sliderUsedRecently = false;
let sliderTimeout;
let manualControl = false; // Flag to indicate user is manually controlling the scenes
let activePieces = []; // Renamed from characterOrbs
let mainFont; // Declare the font variable globally

// Chess board constants
const BOARD_SIZE = 8;
const SQUARE_SIZE = 80;
const BOARD_Y_POSITION = -20;
const PIECE_LIFT_AMOUNT = 0.5; // Pieces will sit slightly above the board plane

// Preload font
function preload() {
  // Properly load the font file
  mainFont = loadFont("assets/fonts/OpenSans-Regular.ttf");
}

function setupBoardForEvent() {
  // Clear previous pieces
  activePieces = [];

  // Renamed from updateActiveCharacterOrbs
  const currentEvent = storyEvents[currentEventIndex];

  if (
    currentEvent &&
    currentEvent.boardSetup &&
    Array.isArray(currentEvent.boardSetup)
  ) {
    currentEvent.boardSetup.forEach((pieceSetup) => {
      const characterStyle =
        characterStyles[pieceSetup.name] || characterStyles["default"];

      // Use mapBoardTo3D for accurate 3D positioning
      const position3D = mapBoardTo3D(pieceSetup.position);

      activePieces.push({
        name: pieceSetup.name,
        boardPosition: pieceSetup.position, // e.g., "e4"

        // From characterStyles
        pieceType: characterStyle.pieceType,
        side: characterStyle.side,
        modelKey: characterStyle.modelKey, // For future 3D models
        color: characterStyle.color, // For p5.js primitive rendering

        // 3D position and state
        current3DPos: { x: position3D.x, y: position3D.y, z: position3D.z },
        target3DPos: { x: position3D.x, y: position3D.y, z: position3D.z }, // Initially same as current

        isCaptured: false,
        opacity: 1.0,
        size: characterStyle.baseSize || 50, // Use baseSize from style or default to 50
      });
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Set an improved initial camera view to look at the board from a better angle
  // This camera position gives a clear view of the board and pieces
  camera(
    0,
    -300,
    600, // Camera position: slightly higher and further back
    0,
    BOARD_Y_POSITION,
    0, // Look at the center of the board
    0,
    1,
    0 // Up vector
  );

  // Use the properly loaded font
  textFont(mainFont);
  setupBoardForEvent(); // Initialize pieces for the first event, was updateActiveCharacterOrbs
  updateInfoPanel(); // Initial call to set up info panel
  updateModeIndicator(); // Initialize the mode indicator

  // Setup slider listener and scene markers
  const slider = document.getElementById("sceneSlider");
  if (slider) {
    slider.max = storyEvents.length - 1;

    // Remove any existing markers container before adding a new one
    const existingContainer = document.querySelector(
      ".slider-markers-container"
    );
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create markers container
    const markersContainer = document.createElement("div");
    markersContainer.className = "slider-markers-container";
    slider.parentNode.appendChild(markersContainer);

    // Add scene markers with scene numbers
    storyEvents.forEach((event, index) => {
      const marker = document.createElement("div");
      marker.className = "scene-marker";
      marker.textContent = index + 1; // Scene number

      // Calculate marker position based on index and total
      const percentage = (index / (storyEvents.length - 1)) * 100;
      marker.style.left = `${percentage}%`;
      markersContainer.appendChild(marker);
    });

    slider.addEventListener("input", () => {
      // Permanently set to manual control mode when slider is used
      manualControl = true;

      let sliderValue = parseInt(slider.value);
      if (sliderValue !== currentEventIndex) {
        currentEventIndex = sliderValue;
        updateInfoPanel();
        setupBoardForEvent();

        // Process special actions for the new event selected by slider
        const currentEvent = storyEvents[currentEventIndex];
        if (currentEvent.specialActions) {
          currentEvent.specialActions.forEach((action) => {
            if (action.type === "defeat" || action.type === "capture") {
              const targetPiece = activePieces.find(
                (piece) =>
                  piece.name === action.character ||
                  piece.name === action.target
              );
              if (targetPiece) {
                targetPiece.isCaptured = true;
              }
            }
          });
        }
      }
    });
  }
}

function updateInfoPanel() {
  if (
    storyEvents &&
    storyEvents.length > currentEventIndex &&
    currentEventIndex >= 0
  ) {
    const event = storyEvents[currentEventIndex];
    document.getElementById("chapterTitle").innerText = event.title;
    document.getElementById("eventDescription").innerText = event.description;
    document.getElementById("characterFocus").innerText =
      "Focus: " + event.focus;

    // Update progress bar
    const progressPercentage =
      ((currentEventIndex + 1) / storyEvents.length) * 100;
    document.getElementById("progressFill").style.width =
      progressPercentage + "%";
  }
}

function draw() {
  background(5, 5, 15);
  orbitControl(); // Allows user to change camera after initial setup

  // Only increment animation time in auto mode
  if (!paused && !manualControl) {
    animationTime += 0.5; // Significantly increased animation time increment for visible progression
  }

  let currentEvent = storyEvents[currentEventIndex];

  // Only check slider in manual control mode to prevent auto-progression from overriding
  if (manualControl && document.getElementById("sceneSlider")) {
    let sliderValue = parseInt(document.getElementById("sceneSlider").value);
    if (sliderValue !== currentEventIndex) {
      currentEventIndex = sliderValue;
      currentEvent = storyEvents[currentEventIndex];
      // Don't need to update animationTime here since we're in manual mode
      updateInfoPanel();
      setupBoardForEvent(); // Was updateActiveCharacterOrbs
      // Process special actions for the new event selected by slider
      if (currentEvent.specialActions) {
        currentEvent.specialActions.forEach((action) => {
          if (action.type === "defeat" || action.type === "capture") {
            // Will be 'capture'
            const targetPiece = activePieces.find(
              // Was targetOrb, characterOrbs
              (piece) =>
                piece.name === action.character || piece.name === action.target
            );
            if (targetPiece) {
              targetPiece.isCaptured = true; // Will be isCaptured
            }
          }
        });
      }
    }
  }
  // Only perform automatic progression if not in manual control mode
  else if (!manualControl) {
    // Increased auto-progression rate for clearly visible advancement
    let newEventIndex = Math.floor((animationTime * 0.02) % storyEvents.length); // Increased from 0.005 to 0.02 for more noticeable progression

    // Check if we're looping back to the beginning
    const isLoopingBack = currentEventIndex > newEventIndex;

    if (newEventIndex !== currentEventIndex) {
      // Clear any special effects when looping back to beginning
      if (isLoopingBack) {
        clearAllSpecialEffects();
      }

      currentEventIndex = newEventIndex;
      currentEvent = storyEvents[currentEventIndex];

      // Update the slider position to reflect the current scene in auto mode
      const slider = document.getElementById("sceneSlider");
      if (slider) {
        slider.value = currentEventIndex;
      }

      updateInfoPanel();
      setupBoardForEvent(); // Was updateActiveCharacterOrbs

      if (currentEvent.specialActions) {
        currentEvent.specialActions.forEach((action) => {
          if (action.type === "defeat" || action.type === "capture") {
            // Will be 'capture'
            const targetPiece = activePieces.find(
              // Was targetOrb, characterOrbs
              (piece) =>
                piece.name === action.character || piece.name === action.target
            );
            if (targetPiece) {
              targetPiece.isCaptured = true; // Will be isCaptured
            }
          }
        });
      }
    }
  }

  // Set lighting based on current event
  if (currentEvent && currentEvent.color) {
    // Increase ambient light for better visibility
    ambientLight(
      min(255, currentEvent.color[0] * 0.8),
      min(255, currentEvent.color[1] * 0.8),
      min(255, currentEvent.color[2] * 0.8)
    );

    // Add directional light from above to highlight pieces and board
    directionalLight(
      min(255, currentEvent.color[0] * 1.4),
      min(255, currentEvent.color[1] * 1.4),
      min(255, currentEvent.color[2] * 1.4),
      0.2,
      -1,
      -0.3 // Light direction: from above and slightly in front at an angle
    );

    // Add a point light at the center for extra illumination
    pointLight(
      currentEvent.color[0],
      currentEvent.color[1],
      currentEvent.color[2],
      0,
      -100,
      0 // Position above the board
    );
  } else {
    // Default lighting if no event color
    ambientLight(150, 150, 150);
    directionalLight(200, 200, 200, 0, -1, -0.5);
  }

  // Draw the chessboard
  drawChessboard();

  // Draw Bhima's central presence (optional - can be removed if not needed)
  if (currentEvent && currentEvent.color) {
    fill(
      currentEvent.color[0],
      currentEvent.color[1],
      currentEvent.color[2],
      100
    );
  } else {
    fill(150, 150, 150, 100);
  }
  noStroke();

  let pulse = sin(animationTime * 5) * 10;
  let baseSize = 20; // Reduced size since we now have chess pieces
  if (currentEvent && typeof currentEvent.intensity !== "undefined") {
    baseSize = 15 + currentEvent.intensity * 15;
  }
  push();
  translate(0, 50, 0); // Move above the board
  sphere(baseSize + pulse); // This sphere represents Bhima's presence/narrative focus
  pop();

  // Consolidated loop for drawing chess pieces and their names
  activePieces.forEach((piece) => {
    // 1. Update animation state for the piece
    if (piece.isCaptured) {
      // If captured, animate sinking and fading - much slower animation for dramatic effect
      if (!piece.captureProgress || piece.captureProgress < 1) {
        // Slow down the capture animation by reducing the increment value
        piece.captureProgress = (piece.captureProgress || 0) + 0.005; // Much slower animation (was 0.02)

        // Calculate opacity with a dramatic curve
        if (piece.captureProgress < 0.7) {
          // Stay more visible during most of the animation
          piece.opacity = lerp(1.0, 0.7, piece.captureProgress / 0.7);
        } else {
          // Then fade out more quickly at the end
          piece.opacity = lerp(0.7, 0, (piece.captureProgress - 0.7) / 0.3);
        }

        // Animate Y position for sinking effect, relative to its original board position
        piece.current3DPos.y = lerp(
          piece.target3DPos.y, // Start from its normal Y on board
          piece.target3DPos.y - piece.size * 0.75, // Sink down by 3/4 of its size
          piece.captureProgress
        );
      }
    } else {
      // For non-captured pieces, ensure full opacity
      piece.opacity = 1.0;
      piece.captureProgress = 0; // Reset capture progress

      // Handle special animation states for non-captured pieces
      if (piece.isAnimating && piece.specialAnimation) {
        // Increment animation progress
        piece.animationProgress = (piece.animationProgress || 0) + 0.01;

        // Handle different animation types
        switch (piece.specialAnimation) {
          case "pulse":
            // Pulsing size
            piece.animScale = 1.0 + sin(piece.animationProgress * 5) * 0.2;
            break;

          case "tremble":
            // Small random movement
            piece.animOffsetX = sin(piece.animationProgress * 20) * 5;
            piece.animOffsetZ = cos(piece.animationProgress * 15) * 5;
            break;

          case "poisoned":
            // Wobble and fade slightly
            piece.animOffsetX = sin(piece.animationProgress * 10) * 3;
            piece.animOffsetZ = cos(piece.animationProgress * 8) * 3;
            piece.opacity = 0.8 + sin(piece.animationProgress * 5) * 0.2;
            break;

          case "approach":
            // Move toward temp target
            if (piece.tempTarget) {
              piece.current3DPos.x = lerp(
                piece.current3DPos.x,
                piece.tempTarget.x,
                0.02
              );
              piece.current3DPos.y = lerp(
                piece.current3DPos.y,
                piece.tempTarget.y,
                0.02
              );
              piece.current3DPos.z = lerp(
                piece.current3DPos.z,
                piece.tempTarget.z,
                0.02
              );
            }
            break;

          case "circle":
            // Circular movement
            const radius = 20;
            piece.animOffsetX = cos(piece.animationProgress * 2) * radius;
            piece.animOffsetZ = sin(piece.animationProgress * 2) * radius;
            break;

          case "humiliated":
            // Lower position and tremble
            if (piece.tempTarget) {
              piece.current3DPos.y = lerp(
                piece.current3DPos.y,
                piece.tempTarget.y,
                0.05
              );
            }
            piece.animOffsetX = sin(piece.animationProgress * 15) * 2;
            piece.animOffsetZ = cos(piece.animationProgress * 12) * 2;
            break;

          case "plotting":
            // Subtle movement suggesting scheming
            piece.animOffsetX = sin(piece.animationProgress * 3) * 7;
            piece.animOffsetZ = cos(piece.animationProgress * 2) * 7;
            break;

          case "gather":
            // Move toward temp target for gathering
            if (piece.tempTarget) {
              piece.current3DPos.x = lerp(
                piece.current3DPos.x,
                piece.tempTarget.x,
                0.03
              );
              piece.current3DPos.z = lerp(
                piece.current3DPos.z,
                piece.tempTarget.z,
                0.03
              );
            }
            break;

          case "battle":
            // Rapid jerky movements
            piece.animOffsetX = sin(piece.animationProgress * 25) * 8;
            piece.animOffsetZ = cos(piece.animationProgress * 20) * 8;
            break;

          case "charge":
            // Quick forward movement then return
            const amplitude = 15;
            piece.animOffsetX = sin(piece.animationProgress * 8) * amplitude;
            piece.animOffsetZ = cos(piece.animationProgress * 6) * amplitude;
            break;

          case "attack":
            // Quick striking movement
            piece.animOffsetX = sin(piece.animationProgress * 15) * 10;
            piece.animOffsetZ = cos(piece.animationProgress * 12) * 10;
            break;

          case "vengeance":
            // Intense pulsing
            piece.animScale = 1.0 + sin(piece.animationProgress * 10) * 0.3;
            break;

          case "victory":
            // Subtle glow effect (visual handled in drawing)
            piece.animScale = 1.0 + sin(piece.animationProgress * 3) * 0.1;
            break;

          case "ascend":
            // Move upward
            if (piece.tempTarget) {
              piece.current3DPos.y = lerp(
                piece.current3DPos.y,
                piece.tempTarget.y,
                0.01
              );
            }
            piece.animOffsetX = sin(piece.animationProgress * 2) * 5;
            piece.animOffsetZ = cos(piece.animationProgress * 2) * 5;
            break;
        }
      } else {
        // If no special animation, ensure animation values are reset
        piece.animScale = 1.0;
        piece.animOffsetX = 0;
        piece.animOffsetZ = 0;

        // Animate movement - smoothly move toward target position
        const movementSpeed = 0.05; // Adjust speed as needed

        // X position
        if (piece.current3DPos.x !== piece.target3DPos.x) {
          piece.current3DPos.x = lerp(
            piece.current3DPos.x,
            piece.target3DPos.x,
            movementSpeed
          );
        }

        // Y position (height)
        if (piece.current3DPos.y !== piece.target3DPos.y) {
          piece.current3DPos.y = lerp(
            piece.current3DPos.y,
            piece.target3DPos.y,
            movementSpeed
          );
        }

        // Z position
        if (piece.current3DPos.z !== piece.target3DPos.z) {
          piece.current3DPos.z = lerp(
            piece.current3DPos.z,
            piece.target3DPos.z,
            movementSpeed
          );
        }
      }
    }

    // 2. If piece is visible (opacity > 0.01), draw it and its name
    if (piece.opacity > 0.01) {
      // a. Draw the chess piece itself
      drawChessPiece(piece); // drawChessPiece uses piece.current3DPos and PIECE_LIFT_AMOUNT

      // b. Draw character name with better visibility
      let actualPrimitiveHeightForText;
      // Calculate the visual height of the piece for accurate text positioning
      switch (piece.pieceType) {
        case "Pawn":
          actualPrimitiveHeightForText = piece.size * 0.8;
          break;
        case "Rook":
          actualPrimitiveHeightForText = piece.size * 1.2;
          break;
        case "Knight":
          actualPrimitiveHeightForText = piece.size * 1.3;
          break;
        case "Bishop":
          actualPrimitiveHeightForText = piece.size * 1.6;
          break;
        case "Queen":
          actualPrimitiveHeightForText = piece.size * 2.1;
          break; // Height of cylinder + sphere
        case "King":
          actualPrimitiveHeightForText = piece.size * 2.0;
          break;
        case "Special":
          actualPrimitiveHeightForText = piece.size * 1.2;
          break;
        default:
          actualPrimitiveHeightForText = piece.size;
          break;
      }

      push();
      // Position text properly above the piece
      // The text should be positioned at the original piece position
      // Plus the height of the piece to get to the top
      // Plus an offset to get slightly above that
      let textYOffset = actualPrimitiveHeightForText * 1.2 + 20; // Additional offset for better visibility

      // Position text significantly higher above piece
      translate(
        piece.current3DPos.x,
        piece.current3DPos.y - textYOffset, // We subtract because negative Y is up
        piece.current3DPos.z
      );

      // Make text face the camera (always readable)
      // Get the inverse of the camera rotation to make text face camera
      rotateY(-frameCount * 0.01); // Simple rotation to make text more visible from different angles

      // Ensure we're using the loaded font for each text element
      textFont(mainFont);
      textAlign(CENTER, CENTER);
      textSize(24); // Larger text size

      // Draw text with a black outline for better readability
      fill(0); // Black outline
      // Draw text at slightly offset positions to create an outline effect
      for (let xOffset = -1; xOffset <= 1; xOffset += 2) {
        for (let yOffset = -1; yOffset <= 1; yOffset += 2) {
          text(piece.name, xOffset, yOffset);
        }
      }

      // Draw the text in white
      fill(255, 255, 255, piece.opacity * 255);
      text(piece.name, 0, 0);

      pop();
    }
  });
  // End of consolidated piece and text drawing loop

  // Draw UI elements last to ensure they appear on top of 3D content
  drawUIElements();
  handleSpecialSceneAnimations(currentEvent); // Add this line to call the special scene animations
}

// Function to convert chess notation to 3D coordinates
function mapBoardTo3D(boardPosition) {
  if (!boardPosition || boardPosition.length !== 2) {
    return { x: 0, y: BOARD_Y_POSITION, z: 0 };
  }

  const file = boardPosition.charAt(0); // a-h
  const rank = parseInt(boardPosition.charAt(1)); // 1-8

  // Convert file (a-h) to x coordinate (-3.5 to 3.5 squares)
  const fileIndex = file.charCodeAt(0) - "a".charCodeAt(0);
  const x = (fileIndex - 3.5) * SQUARE_SIZE;

  // Convert rank (1-8) to z coordinate (-3.5 to 3.5 squares)
  const z = (rank - 4.5) * SQUARE_SIZE;

  return { x: x, y: BOARD_Y_POSITION, z: z };
}

// Function to draw the chessboard
function drawChessboard() {
  push();
  translate(0, BOARD_Y_POSITION, 0);

  // Draw the board border
  noStroke();
  fill(120, 80, 40); // Dark wooden border
  box(SQUARE_SIZE * 8.4, 10, SQUARE_SIZE * 8.4); // Slightly larger than the board

  // Draw individual squares with alternating colors
  for (let rank = 1; rank <= 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const fileChar = String.fromCharCode("a".charCodeAt(0) + file);
      const isLight = (rank + file) % 2 === 0;

      push();
      const squarePos = mapBoardTo3D(fileChar + rank);
      translate(squarePos.x, -5, squarePos.z); // Position squares ABOVE the board (-5 is up)      // Use high contrast colors for better chess board visibility
      if (isLight) {
        fill(245, 235, 200); // Lighter, cream colored square
      } else {
        fill(80, 45, 20); // Much darker brown for contrast
      }

      // Clean edges with minimal stroke
      stroke(40, 30, 15);
      strokeWeight(0.3);

      // Draw square using box - slightly thinner for better visibility
      box(SQUARE_SIZE * 0.98, 5, SQUARE_SIZE * 0.98);

      // Draw coordinate labels on border squares
      if (rank === 1 || rank === 8 || file === 0 || file === 7) {
        push();
        translate(0, 5, 0); // Position slightly above the square

        // Set text properties and ensure we use the loaded font
        textFont(mainFont);
        textSize(14);
        textAlign(CENTER, CENTER);
        fill(0); // Black text

        // Draw different labels based on edge position
        if (rank === 1) {
          // Bottom edge - draw file letter
          text(fileChar, 0, SQUARE_SIZE * 0.4);
        }
        if (file === 0) {
          // Left edge - draw rank number
          text(rank, -SQUARE_SIZE * 0.4, 0);
        }
        pop();
      }
      pop();
    }
  }
  pop();
}

// Function to draw individual chess pieces
function drawChessPiece(piece) {
  push();
  // Add stroke outline to make pieces more visible against the board
  stroke(0);
  strokeWeight(1);
  fill(piece.color[0], piece.color[1], piece.color[2], piece.opacity * 255);

  let actualPrimitiveHeight;
  // Determine the main height of the primitive for positioning
  switch (piece.pieceType) {
    case "Pawn":
      actualPrimitiveHeight = piece.size * 0.8; // Increased size
      break;
    case "Rook":
      actualPrimitiveHeight = piece.size * 1.2; // Increased size
      break;
    case "Knight":
      actualPrimitiveHeight = piece.size * 1.3; // Increased size
      break;
    case "Bishop":
      actualPrimitiveHeight = piece.size * 1.6; // Increased size
      break;
    case "Queen":
      actualPrimitiveHeight = piece.size * 1.8; // Increased size
      break;
    case "King":
      actualPrimitiveHeight = piece.size * 2.0; // Increased size
      break;
    case "Special":
      actualPrimitiveHeight = piece.size * 1.2; // Increased size
      break;
    default:
      actualPrimitiveHeight = piece.size; // Increased size
      break;
  }

  // Correct the Y position so pieces sit ON the board rather than below it
  let yTranslate = piece.current3DPos.y - PIECE_LIFT_AMOUNT;
  translate(piece.current3DPos.x, yTranslate, piece.current3DPos.z);

  // Make all pieces bigger for better visibility
  let sizeMultiplier = 1.0; // Reduced multiplier for more proportionate pieces

  switch (piece.pieceType) {
    case "Pawn":
      // Draw a chess pawn - sphere on top of a small cylinder
      // Base
      push();
      translate(0, -piece.size * 0.2, 0);
      cylinder(piece.size * 0.3, piece.size * 0.4);
      pop();

      // Top
      push();
      translate(0, -piece.size * 0.5, 0);
      sphere(piece.size * 0.25);
      pop();
      break;

    case "Rook":
      // Draw a castle/rook - cylinder with castle-like top
      // Base
      push();
      translate(0, -piece.size * 0.35, 0);
      cylinder(piece.size * 0.3, piece.size * 0.7);
      pop();

      // Top castle part (wider than base)
      push();
      translate(0, -piece.size * 0.75, 0);
      cylinder(piece.size * 0.35, piece.size * 0.15);
      pop();
      break;

    case "Knight":
      // Draw a knight - represent as L-shaped form
      push();
      // Base
      translate(0, -piece.size * 0.3, 0);
      cylinder(piece.size * 0.3, piece.size * 0.6);

      // Head part (rotated box for horse head appearance)
      push();
      translate(piece.size * 0.15, -piece.size * 0.7, 0);
      rotateZ(PI / 4);
      box(piece.size * 0.4, piece.size * 0.35, piece.size * 0.25);
      pop();
      pop();
      break;

    case "Bishop":
      // Draw a bishop - thin spire with ball top
      push();
      // Base
      translate(0, -piece.size * 0.3, 0);
      cylinder(piece.size * 0.3, piece.size * 0.6);

      // Middle narrow part
      translate(0, -piece.size * 0.4, 0);
      cylinder(piece.size * 0.2, piece.size * 0.4);

      // Top ball/sphere
      translate(0, -piece.size * 0.3, 0);
      sphere(piece.size * 0.25);

      // Small top notch
      translate(0, -piece.size * 0.3, 0);
      sphere(piece.size * 0.1);
      pop();
      break;

    case "Queen":
      // Draw a queen - cylinder base with crown-like top
      push();
      // Base
      translate(0, -piece.size * 0.3, 0);
      cylinder(piece.size * 0.3, piece.size * 0.6);

      // Middle part
      translate(0, -piece.size * 0.35, 0);
      cylinder(piece.size * 0.35, piece.size * 0.15);

      // Crown part (wider at top)
      translate(0, -piece.size * 0.15, 0);
      cylinder(piece.size * 0.4, piece.size * 0.2);

      // Top ball
      translate(0, -piece.size * 0.2, 0);
      sphere(piece.size * 0.2);
      pop();
      break;

    case "King":
      // Draw a king - similar to queen but with cross on top
      push();
      // Base
      translate(0, -piece.size * 0.3, 0);
      cylinder(piece.size * 0.3, piece.size * 0.6);

      // Middle part
      translate(0, -piece.size * 0.35, 0);
      cylinder(piece.size * 0.35, piece.size * 0.15);

      // Crown part
      translate(0, -piece.size * 0.15, 0);
      cylinder(piece.size * 0.4, piece.size * 0.2);

      // Cross vertical part
      translate(0, -piece.size * 0.3, 0);
      box(piece.size * 0.08, piece.size * 0.4, piece.size * 0.08);

      // Cross horizontal part
      box(piece.size * 0.25, piece.size * 0.08, piece.size * 0.08);
      pop();
      break;

    case "Special": // Krishna - special piece
      push();
      // Base
      translate(0, -piece.size * 0.3, 0);
      cylinder(piece.size * 0.3, piece.size * 0.6);

      // Middle
      translate(0, -piece.size * 0.4, 0);
      sphere(piece.size * 0.35);

      // Top - distinctive flute shape for Krishna
      push();
      translate(piece.size * 0.2, -piece.size * 0.2, 0);
      rotateZ(-PI / 4);
      cylinder(piece.size * 0.05, piece.size * 0.4);
      pop();
      pop();
      break;

    default:
      // Default simple piece
      translate(0, -piece.size * 0.4, 0);
      sphere(piece.size * 0.4);
      break;
  }
  pop();
}

// Function to draw UI elements in 2D mode
function drawUIElements() {
  // Save current camera settings
  push();

  // Switch to 2D mode for UI elements
  // This is the critical part - we need to properly reset to 2D
  resetMatrix();
  ortho(0, width, 0, height, -1, 1);
  camera();

  // Update the HTML mode indicator instead of drawing in canvas
  updateModeIndicator();

  // Keep text style normal for other UI elements
  textStyle(NORMAL);

  // Show pause status if applicable
  if (paused) {
    fill(255, 255, 0);
    textAlign(CENTER, TOP);
    text("PAUSED", width / 2, 20);
  }

  // Add instructions at the bottom of the screen
  fill(255);
  textAlign(LEFT, BOTTOM);
  text(
    "Space: Pause/Resume • R: Reset view • M: Manual mode • A: Auto mode",
    20,
    height - 20
  );

  // Draw current scene number/total
  textAlign(RIGHT, BOTTOM);
  text(
    `Scene ${currentEventIndex + 1}/${storyEvents.length}`,
    width - 20,
    height - 20
  );

  pop();
}

function keyPressed() {
  if (key === " ") {
    paused = !paused;
    updateModeIndicator();
  } else if (key === "r" || key === "R") {
    animationTime = 0;
  } else if (key === "m" || key === "M") {
    // Switch to manual control mode
    manualControl = true;
    // Update the slider to current position
    const slider = document.getElementById("sceneSlider");
    if (slider) {
      slider.value = currentEventIndex;
    }
    updateModeIndicator();
  } else if (key === "a" || key === "A") {
    // Switch to automatic control mode
    manualControl = false;
    // Sync animation time to current position to prevent jumping
    // Calculate animation time based on current index so we don't reset to scene 0
    animationTime = currentEventIndex * 100;
    setupBoardForEvent(); // Was updateActiveCharacterOrbs
    updateInfoPanel();
    if (paused) paused = false;
    updateModeIndicator();
  }
}

// Function to update the HTML mode indicator
function updateModeIndicator() {
  const modeIndicator = document.getElementById("modeIndicator");
  if (modeIndicator) {
    // Remove all existing classes first
    modeIndicator.classList.remove("mode-auto", "mode-manual", "mode-paused");

    // Add appropriate class based on current state
    if (paused) {
      modeIndicator.classList.add("mode-paused");
      modeIndicator.innerText = "PAUSED";
    } else if (manualControl) {
      modeIndicator.classList.add("mode-manual");
      modeIndicator.innerText = "MANUAL MODE";
    } else {
      modeIndicator.classList.add("mode-auto");
      modeIndicator.innerText = "AUTO ADVANCING";
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Function to handle special scene-specific animations
function handleSpecialSceneAnimations(currentEvent) {
  // Clear any previous effects
  clearAllSpecialEffects();

  // If no current event, exit early
  if (!currentEvent) return;

  // Apply scene-specific animations based on the event title
  switch (currentEvent.title) {
    case "The Outsider's Birth":
      handleBirthSceneAnimation();
      break;

    case "Childhood Jealousy":
      handleJealousySceneAnimation();
      break;

    case "The Poison Incident":
      handlePoisonSceneAnimation();
      break;

    case "Marriage to Hidimbi":
      handleMarriageSceneAnimation();
      break;

    case "Draupadi's Swayamvara":
      handleSwayamvaraSceneAnimation();
      break;

    case "The Dice Game":
      handleDiceGameSceneAnimation();
      break;

    case "Exile and Reflection":
      handleExileSceneAnimation();
      break;

    case "The Great War":
      handleWarSceneAnimation();
      break;

    case "Dushasana's End":
      handleDushasanaDeathSceneAnimation();
      break;

    case "Victory's Burden":
      handleVictorySceneAnimation();
      break;

    case "The Final Journey":
      handleFinalJourneySceneAnimation();
      break;

    default:
      // Default animation for any other scenes
      handleDefaultSceneAnimation();
      break;
  }
}

// Helper function to clear all special effects
function clearAllSpecialEffects() {
  // Remove any blood effects
  const bloodEffects = document.querySelectorAll(
    ".blood-effect, .blood-effects-container"
  );
  bloodEffects.forEach((effect) => effect.remove());

  // Remove any other special effect elements
  const specialEffects = document.querySelectorAll(
    ".birth-effect, .jealousy-effect, .poison-effect, .marriage-effect, .swayamvara-effect, .dice-effect, .exile-effect, .war-effect, .victory-effect, .final-journey-effect"
  );
  specialEffects.forEach((effect) => effect.remove());

  // Reset any piece-specific animation states
  activePieces.forEach((piece) => {
    piece.isAnimating = false;
    piece.specialAnimation = null;
    piece.animationProgress = 0;

    // Reset any temporary movement animations
    if (!piece.isCaptured) {
      piece.target3DPos = mapBoardTo3D(piece.boardPosition);
    }
  });
}

// The Outsider's Birth - pulsing light effect around Bhima's piece
function handleBirthSceneAnimation() {
  const bhimaPiece = activePieces.find((piece) => piece.name === "Bhima");
  if (!bhimaPiece) return;

  // Make Bhima's piece pulse larger and smaller
  bhimaPiece.isAnimating = true;
  bhimaPiece.specialAnimation = "pulse";

  // Create a birth aura effect
  const container = document.createElement("div");
  container.className = "birth-effect";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "150";

  // Add a subtle golden glow to the scene
  const glowEffect = document.createElement("div");
  glowEffect.style.position = "absolute";
  glowEffect.style.top = "0";
  glowEffect.style.left = "0";
  glowEffect.style.width = "100%";
  glowEffect.style.height = "100%";
  glowEffect.style.background =
    "radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(0, 0, 0, 0) 70%)";
  glowEffect.style.animation = "pulse 4s ease-in-out infinite";
  container.appendChild(glowEffect);

  document.body.appendChild(container);
}

// Childhood Jealousy - slight trembling/vibration of pieces
function handleJealousySceneAnimation() {
  // Find Bhima and Arjuna pieces
  const bhimaPiece = activePieces.find((piece) => piece.name === "Bhima");
  const arjunaPiece = activePieces.find((piece) => piece.name === "Arjuna");

  if (bhimaPiece && arjunaPiece) {
    // Make the pieces slightly tremble
    bhimaPiece.isAnimating = true;
    bhimaPiece.specialAnimation = "tremble";
    arjunaPiece.isAnimating = true;
    arjunaPiece.specialAnimation = "tremble";

    // Create an atmosphere of tension with a reddish hue
    const container = document.createElement("div");
    container.className = "jealousy-effect";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.background =
      "radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, rgba(0, 0, 0, 0) 70%)";
    container.style.pointerEvents = "none";
    container.style.zIndex = "150";

    document.body.appendChild(container);
  }
}

// The Poison Incident - green pulsing effect around Bhima
function handlePoisonSceneAnimation() {
  const bhimaPiece = activePieces.find((piece) => piece.name === "Bhima");
  const duryodhanaPiece = activePieces.find(
    (piece) => piece.name === "Duryodhana"
  );

  if (bhimaPiece) {
    // Poison effect - make Bhima wobble and fade slightly
    bhimaPiece.isAnimating = true;
    bhimaPiece.specialAnimation = "poisoned";

    // Create poison effect with green color
    const container = document.createElement("div");
    container.className = "poison-effect";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "150";

    // Add a green mist effect
    const mistEffect = document.createElement("div");
    mistEffect.style.position = "absolute";
    mistEffect.style.top = "30%";
    mistEffect.style.left = "40%";
    mistEffect.style.width = "20%";
    mistEffect.style.height = "20%";
    mistEffect.style.background =
      "radial-gradient(circle, rgba(0, 128, 0, 0.3) 0%, rgba(0, 0, 0, 0) 70%)";
    mistEffect.style.animation = "pulse 3s ease-in-out infinite";
    container.appendChild(mistEffect);

    document.body.appendChild(container);

    // If Duryodhana is present, make him move slightly toward Bhima
    if (duryodhanaPiece) {
      // Create movement vector toward Bhima
      const dirX = bhimaPiece.current3DPos.x - duryodhanaPiece.current3DPos.x;
      const dirZ = bhimaPiece.current3DPos.z - duryodhanaPiece.current3DPos.z;

      // Calculate a position partway between the current position and Bhima
      const partialX = duryodhanaPiece.current3DPos.x + dirX * 0.3;
      const partialZ = duryodhanaPiece.current3DPos.z + dirZ * 0.3;

      // Set as temporary target for smooth movement
      duryodhanaPiece.tempTarget = {
        x: partialX,
        y: duryodhanaPiece.current3DPos.y,
        z: partialZ,
      };

      duryodhanaPiece.isAnimating = true;
      duryodhanaPiece.specialAnimation = "approach";
    }
  }
}

// Marriage to Hidimbi - create a celebratory effect
function handleMarriageSceneAnimation() {
  const bhimaPiece = activePieces.find((piece) => piece.name === "Bhima");
  const hidimbiPiece = activePieces.find((piece) => piece.name === "Hidimbi");

  if (bhimaPiece && hidimbiPiece) {
    // Make the pieces move slightly toward each other
    const midX = (bhimaPiece.current3DPos.x + hidimbiPiece.current3DPos.x) / 2;
    const midZ = (bhimaPiece.current3DPos.z + hidimbiPiece.current3DPos.z) / 2;

    bhimaPiece.tempTarget = {
      x: midX + (bhimaPiece.current3DPos.x - midX) * 0.7,
      y: bhimaPiece.current3DPos.y,
      z: midZ + (bhimaPiece.current3DPos.z - midZ) * 0.7,
    };

    hidimbiPiece.tempTarget = {
      x: midX + (hidimbiPiece.current3DPos.x - midX) * 0.7,
      y: hidimbiPiece.current3DPos.y,
      z: midZ + (hidimbiPiece.current3DPos.z - midZ) * 0.7,
    };

    bhimaPiece.isAnimating = true;
    bhimaPiece.specialAnimation = "approach";
    hidimbiPiece.isAnimating = true;
    hidimbiPiece.specialAnimation = "approach";

    // Create celebration effect
    const container = document.createElement("div");
    container.className = "marriage-effect";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "150";

    // Add floating particles for a celebratory effect
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = "10px";
      particle.style.height = "10px";
      particle.style.borderRadius = "50%";
      particle.style.background = "rgba(255, 255, 255, 0.7)";
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animation = `float ${
        3 + Math.random() * 4
      }s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(particle);
    }

    document.body.appendChild(container);
  }
}

// Draupadi's Swayamvara - elegant swirling effect
function handleSwayamvaraSceneAnimation() {
  const draupadiPiece = activePieces.find((piece) => piece.name === "Draupadi");
  const arjunaPiece = activePieces.find((piece) => piece.name === "Arjuna");

  if (draupadiPiece && arjunaPiece) {
    // Make Draupadi do a small circular motion
    draupadiPiece.isAnimating = true;
    draupadiPiece.specialAnimation = "circle";
    draupadiPiece.animationProgress = 0;

    // Make Arjuna approach slightly
    arjunaPiece.isAnimating = true;
    arjunaPiece.specialAnimation = "approach";

    const dirX = draupadiPiece.current3DPos.x - arjunaPiece.current3DPos.x;
    const dirZ = draupadiPiece.current3DPos.z - arjunaPiece.current3DPos.z;

    // Calculate a position partway between the current position and Draupadi
    const partialX = arjunaPiece.current3DPos.x + dirX * 0.4;
    const partialZ = arjunaPiece.current3DPos.z + dirZ * 0.4;

    // Set as temporary target for smooth movement
    arjunaPiece.tempTarget = {
      x: partialX,
      y: arjunaPiece.current3DPos.y,
      z: partialZ,
    };

    // Create a ceremonial effect
    const container = document.createElement("div");
    container.className = "swayamvara-effect";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "150";

    // Add a radiant glow
    const glowEffect = document.createElement("div");
    glowEffect.style.position = "absolute";
    glowEffect.style.top = "0";
    glowEffect.style.left = "0";
    glowEffect.style.width = "100%";
    glowEffect.style.height = "100%";
    glowEffect.style.background =
      "radial-gradient(circle, rgba(255, 223, 0, 0.1) 0%, rgba(0, 0, 0, 0) 70%)";
    glowEffect.style.animation = "pulse 4s ease-in-out infinite";
    container.appendChild(glowEffect);

    document.body.appendChild(container);
  }
}

// The Dice Game - tension and chaos
function handleDiceGameSceneAnimation() {
  // Find relevant pieces
  const yudhishthiraPiece = activePieces.find(
    (piece) => piece.name === "Yudhishthira"
  );
  const draupadiPiece = activePieces.find((piece) => piece.name === "Draupadi");
  const shakuni = activePieces.find((piece) => piece.name === "Shakuni");

  // Create a tense atmosphere
  const container = document.createElement("div");
  container.className = "dice-effect";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "150";

  // Add a subtle reddish hue for tension
  const tensionEffect = document.createElement("div");
  tensionEffect.style.position = "absolute";
  tensionEffect.style.top = "0";
  tensionEffect.style.left = "0";
  tensionEffect.style.width = "100%";
  tensionEffect.style.height = "100%";
  tensionEffect.style.background =
    "radial-gradient(circle, rgba(128, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 70%)";
  container.appendChild(tensionEffect);

  // Add dice rolling effect
  for (let i = 0; i < 2; i++) {
    const dice = document.createElement("div");
    dice.style.position = "absolute";
    dice.style.width = "20px";
    dice.style.height = "20px";
    dice.style.background = "white";
    dice.style.borderRadius = "3px";
    dice.style.top = "50%";
    dice.style.left = "50%";
    dice.style.transform = "translate(-50%, -50%)";
    dice.style.animation = `roll ${1 + Math.random()}s linear infinite`;
    dice.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.8)";
    container.appendChild(dice);
  }

  document.body.appendChild(container);

  // Animate relevant pieces
  if (yudhishthiraPiece) {
    yudhishthiraPiece.isAnimating = true;
    yudhishthiraPiece.specialAnimation = "tremble";
  }

  if (draupadiPiece) {
    draupadiPiece.isAnimating = true;
    draupadiPiece.specialAnimation = "humiliated";

    // Make Draupadi piece lower slightly
    draupadiPiece.tempTarget = {
      x: draupadiPiece.current3DPos.x,
      y: draupadiPiece.current3DPos.y + 10, // Move down slightly
      z: draupadiPiece.current3DPos.z,
    };
  }

  if (shakuni) {
    shakuni.isAnimating = true;
    shakuni.specialAnimation = "plotting";
  }
}

// Exile and Reflection - calm but somber mood
function handleExileSceneAnimation() {
  // Create a forest/exile atmosphere
  const container = document.createElement("div");
  container.className = "exile-effect";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "150";

  // Add a bluish-green forest tint
  const forestEffect = document.createElement("div");
  forestEffect.style.position = "absolute";
  forestEffect.style.top = "0";
  forestEffect.style.left = "0";
  forestEffect.style.width = "100%";
  forestEffect.style.height = "100%";
  forestEffect.style.background =
    "radial-gradient(circle, rgba(0, 60, 40, 0.15) 0%, rgba(0, 0, 0, 0) 70%)";
  container.appendChild(forestEffect);

  // Add slowly drifting leaves for forest effect
  for (let i = 0; i < 10; i++) {
    const leaf = document.createElement("div");
    leaf.style.position = "absolute";
    leaf.style.width = "8px";
    leaf.style.height = "8px";
    leaf.style.borderRadius = "40% 0 40% 0";
    leaf.style.background = "rgba(0, 80, 20, 0.6)";
    leaf.style.top = `${Math.random() * 100}%`;
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.animation = `float ${
      10 + Math.random() * 10
    }s ease-in-out infinite`;
    leaf.style.animationDelay = `${Math.random() * 5}s`;
    leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(leaf);
  }

  document.body.appendChild(container);

  // Make all Pandava pieces gather closer
  const pandavaPieces = activePieces.filter(
    (piece) =>
      piece.name === "Bhima" ||
      piece.name === "Yudhishthira" ||
      piece.name === "Arjuna" ||
      piece.name === "Nakula" ||
      piece.name === "Sahadeva" ||
      piece.name === "Draupadi"
  );

  if (pandavaPieces.length > 0) {
    // Find center position of all Pandava pieces
    let centerX = 0,
      centerZ = 0;
    pandavaPieces.forEach((piece) => {
      centerX += piece.current3DPos.x;
      centerZ += piece.current3DPos.z;
    });
    centerX /= pandavaPieces.length;
    centerZ /= pandavaPieces.length;

    // Move pieces slightly toward center
    pandavaPieces.forEach((piece) => {
      const dirX = centerX - piece.current3DPos.x;
      const dirZ = centerZ - piece.current3DPos.z;

      // Move 20% toward the center
      piece.tempTarget = {
        x: piece.current3DPos.x + dirX * 0.2,
        y: piece.current3DPos.y,
        z: piece.current3DPos.z + dirZ * 0.2,
      };

      piece.isAnimating = true;
      piece.specialAnimation = "gather";
    });
  }
}

// The Great War - battle animations
function handleWarSceneAnimation() {
  // Create battle atmosphere
  const container = document.createElement("div");
  container.className = "war-effect";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "150";

  // Add a reddish battle haze
  const battleEffect = document.createElement("div");
  battleEffect.style.position = "absolute";
  battleEffect.style.top = "0";
  battleEffect.style.left = "0";
  battleEffect.style.width = "100%";
  battleEffect.style.height = "100%";
  battleEffect.style.background =
    "radial-gradient(circle, rgba(128, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 70%)";
  container.appendChild(battleEffect);

  // Add battle flash effects
  for (let i = 0; i < 5; i++) {
    const flash = document.createElement("div");
    flash.style.position = "absolute";
    flash.style.width = "3px";
    flash.style.height = "20px";
    flash.style.background = "rgba(255, 255, 255, 0.7)";
    flash.style.top = `${20 + Math.random() * 60}%`;
    flash.style.left = `${20 + Math.random() * 60}%`;
    flash.style.animation = `flash ${0.5 + Math.random()}s linear infinite`;
    flash.style.animationDelay = `${Math.random() * 2}s`;
    flash.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(flash);
  }

  document.body.appendChild(container);

  // Animate battle movements for all pieces
  activePieces.forEach((piece) => {
    // Only animate non-captured pieces
    if (!piece.isCaptured) {
      piece.isAnimating = true;

      // Different animations based on piece type
      if (piece.pieceType === "Knight") {
        piece.specialAnimation = "charge";
      } else if (piece.pieceType === "Rook") {
        piece.specialAnimation = "attack";
      } else {
        piece.specialAnimation = "battle";
      }

      // Add small random movement
      piece.tempTarget = {
        x: piece.current3DPos.x + (Math.random() * 20 - 10),
        y: piece.current3DPos.y,
        z: piece.current3DPos.z + (Math.random() * 20 - 10),
      };
    }
  });
}

// Dushasana's End - blood and vengeance
function handleDushasanaDeathSceneAnimation() {
  // Find relevant pieces
  const dushasanaPiece = activePieces.find(
    (piece) => piece.name === "Dushasana"
  );
  const bhimaPiece = activePieces.find((piece) => piece.name === "Bhima");

  if (dushasanaPiece && bhimaPiece) {
    // Special animation for Dushasana's death - only if not already fully captured
    if (dushasanaPiece.isCaptured && dushasanaPiece.captureProgress < 0.5) {
      // Create blood effect elements if they don't exist yet
      if (!document.querySelector(".blood-effect")) {
        createBloodEffects(dushasanaPiece.current3DPos);
      }

      // Move Bhima toward Dushasana for the capture animation
      if (
        dist(
          bhimaPiece.current3DPos.x,
          bhimaPiece.current3DPos.y,
          bhimaPiece.current3DPos.z,
          dushasanaPiece.current3DPos.x,
          dushasanaPiece.current3DPos.y,
          dushasanaPiece.current3DPos.z
        ) >
        SQUARE_SIZE * 1.2
      ) {
        // Calculate direction vector toward Dushasana
        let dirX = dushasanaPiece.current3DPos.x - bhimaPiece.current3DPos.x;
        let dirZ = dushasanaPiece.current3DPos.z - bhimaPiece.current3DPos.z;

        // Normalize and scale for movement speed
        let magnitude = sqrt(dirX * dirX + dirZ * dirZ);
        dirX = (dirX / magnitude) * 3;
        dirZ = (dirZ / magnitude) * 3;

        // Update Bhima's position to move toward Dushasana
        bhimaPiece.current3DPos.x += dirX;
        bhimaPiece.current3DPos.z += dirZ;
      }

      // Intensify Bhima's presence
      bhimaPiece.isAnimating = true;
      bhimaPiece.specialAnimation = "vengeance";
    }
  }
}

// Victory's Burden - somber victory
function handleVictorySceneAnimation() {
  // Create victory atmosphere
  const container = document.createElement("div");
  container.className = "victory-effect";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "150";

  // Add a golden victory glow with a hint of somber mood
  const victoryEffect = document.createElement("div");
  victoryEffect.style.position = "absolute";
  victoryEffect.style.top = "0";
  victoryEffect.style.left = "0";
  victoryEffect.style.width = "100%";
  victoryEffect.style.height = "100%";
  victoryEffect.style.background =
    "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 70%)";
  victoryEffect.style.animation = "pulse 6s ease-in-out infinite";
  container.appendChild(victoryEffect);

  document.body.appendChild(container);

  // Make surviving Pandava pieces glow slightly
  const pandavaPieces = activePieces.filter(
    (piece) =>
      !piece.isCaptured &&
      (piece.name === "Bhima" ||
        piece.name === "Yudhishthira" ||
        piece.name === "Arjuna" ||
        piece.name === "Nakula" ||
        piece.name === "Sahadeva" ||
        piece.name === "Draupadi")
  );

  pandavaPieces.forEach((piece) => {
    piece.isAnimating = true;
    piece.specialAnimation = "victory";
  });
}

// The Final Journey - ascension
function handleFinalJourneySceneAnimation() {
  // Create ascension atmosphere
  const container = document.createElement("div");
  container.className = "final-journey-effect";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "150";

  // Add heavenly light from above
  const lightEffect = document.createElement("div");
  lightEffect.style.position = "absolute";
  lightEffect.style.top = "0";
  lightEffect.style.left = "0";
  lightEffect.style.width = "100%";
  lightEffect.style.height = "100%";
  lightEffect.style.background =
    "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 60%)";
  lightEffect.style.animation = "pulse 8s ease-in-out infinite";
  container.appendChild(lightEffect);

  // Add floating particles ascending
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = "4px";
    particle.style.height = "4px";
    particle.style.borderRadius = "50%";
    particle.style.background = "rgba(255, 255, 255, 0.7)";
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animation = `ascend ${
      5 + Math.random() * 10
    }s linear infinite`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(particle);
  }

  document.body.appendChild(container);

  // Make all remaining pieces slowly ascend
  activePieces.forEach((piece) => {
    if (!piece.isCaptured) {
      piece.isAnimating = true;
      piece.specialAnimation = "ascend";

      // Slowly lift the piece
      piece.tempTarget = {
        x: piece.current3DPos.x,
        y: piece.current3DPos.y - 30, // Move upward
        z: piece.current3DPos.z,
      };
    }
  });
}

// Default animation for any scenes without specific animations
function handleDefaultSceneAnimation() {
  // A subtle ambient effect for any scene
  const container = document.createElement("div");
  container.className = "default-effect";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "150";

  // Add a subtle ambient glow
  const ambientEffect = document.createElement("div");
  ambientEffect.style.position = "absolute";
  ambientEffect.style.top = "0";
  ambientEffect.style.left = "0";
  ambientEffect.style.width = "100%";
  ambientEffect.style.height = "100%";
  ambientEffect.style.background =
    "radial-gradient(circle, rgba(100, 100, 100, 0.1) 0%, rgba(0, 0, 0, 0) 70%)";
  ambientEffect.style.animation = "pulse 5s ease-in-out infinite";
  container.appendChild(ambientEffect);

  document.body.appendChild(container);
}

// Function to create blood effect elements for Dushasana's death scene
function createBloodEffects(position) {
  // Convert 3D position to screen coordinates using project() or a similar approach
  // This is an approximation since we don't have access to the exact screen position
  const bloodContainer = document.createElement("div");
  bloodContainer.className = "blood-effects-container";
  bloodContainer.style.position = "absolute";
  bloodContainer.style.top = "0";
  bloodContainer.style.left = "0";
  bloodContainer.style.width = "100%";
  bloodContainer.style.height = "100%";
  bloodContainer.style.pointerEvents = "none";
  bloodContainer.style.zIndex = "150";
  document.body.appendChild(bloodContainer);

  // Create multiple blood effects for a more dramatic scene
  for (let i = 0; i < 5; i++) {
    const bloodEffect = document.createElement("div");
    bloodEffect.className = "blood-effect";
    bloodEffect.style.left = `${random(30, 70)}%`;
    bloodEffect.style.top = `${random(30, 70)}%`;
    // Vary the size for a more natural effect
    const size = random(40, 80);
    bloodEffect.style.width = `${size}px`;
    bloodEffect.style.height = `${size}px`;
    // Add random delay to animations
    bloodEffect.style.animationDelay = `${random(0, 1)}s`;
    bloodContainer.appendChild(bloodEffect);
  }
}
