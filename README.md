# Randamoozham - A 3D Chess Game Visualization

This project is an immersive 3D visualization of _Randamoozham_, M.T. Vasudevan Nair's masterpiece, experienced through the perspective of its central character, Bhima. It aims to capture the essence of the novel by translating its narrative, strategic depth, and emotional complexity into an interactive, symbolic 3D chess game.

## Visualization Concept: The Mahabharata as a Cosmic Chess Game

The 3D scene reimagines the epic events of _Randamoozham_ as a profound and fated chess game. Key characters are represented by symbolic chess pieces on a 3D board, and pivotal story moments unfold as significant board states or animated move sequences. The visualization seeks to highlight the strategic interactions, power dynamics, moral choices, and the overarching sense of destiny that permeates the novel.

### Core Elements:

1.  **The 3D Chessboard:**

    - The primary stage for the unfolding narrative.
    - The camera, often emphasizing Bhima's piece or strategic situation, can be navigated using `orbitControl()`.
    - The aesthetic of the board and pieces will aim for a style that complements the epic's tone (e.g., ancient Indian motifs, elemental design).

2.  **Characters as Symbolic Chess Pieces:**

    - **Sides:** The Pandavas and their allies will be one color (e.g., white/gold), while the Kauravas and their allies will be a contrasting color (e.g., black/dark red).
    - **Major Characters (Initial Symbolic Ideas - to be refined):**
      - **Bhima:** A **Rook** (symbolizing his immense, direct strength and impact on the battlefield) or a unique custom piece. His piece may feature a subtle visual cue (like a faint pulse or glow) representing his consciousness and central perspective.
      - **Yudhishthira:** The **King** (central to the Pandava cause, his fate dictates much of the "game").
      - **Arjuna:** A **Knight** (for his skill, agility, and dynamic presence) or a **Bishop**.
      - **Duryodhana:** The opposing **King** (leading the Kaurava forces) or a powerful offensive piece like a **Queen** (representing his ambition and control).
      - **Shakuni:** A **Bishop** (symbolizing his cunning, indirect strategies, and manipulative influence) or a custom piece representing deceit.
      - **Krishna:** A unique, highly influential piece that may transcend standard chess roles (e.g., a "Chancellor" or a custom piece with special visual properties or movement capabilities), acting as a divine guide and strategist.
      - **Draupadi:** A **Queen** (a powerful and central figure whose honor and fate are pivotal to the Pandavas' motivations and the course of the game) or a distinct piece whose position heavily influences Pandava strategy.
      - **Karna:** A powerful piece on the Kaurava side, perhaps a **Queen** or a mirrored **Rook/Knight** to Arjuna/Bhima, highlighting his prowess and tragic allegiance.
    - **Minor Characters/Forces:** May be represented by **Pawns** or generic pieces, differentiated by color or subtle model variations.
    - **Piece Representation:** Initially, pieces will be rendered using p5.js 3D primitives (e.g., `box`, `cylinder`, `cone`). In later phases, simple 3D models (`.obj`, `.glb`) may be explored.

3.  **Story Events as Board States & Animated Moves:**

    - Each of the 11 key `storyEvents` will translate to a specific configuration of pieces on the board or a sequence of animated "moves" and "captures."
    - The narrative unfolds by transitioning between these board states, visually depicting the shifts in power, conflicts, alliances, and resolutions.

4.  **Atmosphere and Interactivity:**
    - **Dynamic Lighting & Color:** The `currentEvent.color` and `intensity` properties will continue to influence the ambient lighting and mood around the 3D chessboard, reflecting the emotional tone of each scene.
    - **Animations:** Piece movements, captures, and special character abilities (if defined) will be animated to bring the "game" to life.
    - **User Interface:** The existing info panel (displaying title, description, focus), progress bar, and scene slider will remain relevant for navigating and understanding the story's progression.

## Key Story Moments Visualized (Chess Metaphor)

The visualization progresses through pivotal moments, now interpreted on the chessboard:

1.  **The Outsider's Birth:** Initial board setup. Bhima's piece (Rook) appears, perhaps slightly isolated or distinct from other nascent Pandava pieces.
2.  **Childhood Jealousy:** Bhima's and Arjuna's pieces in positions suggesting rivalry or unequal standing.
3.  **The Poison Incident:** Duryodhana's piece makes an aggressive "move" towards Bhima's, which is visually "weakened" then recovers.
4.  **Marriage to Hidimbi:** An allied piece (Hidimbi) appears, supporting Bhima. An opposing piece (Hidimba) is "captured."
5.  **Draupadi's Swayamvara:** Draupadi's piece (Queen) is "won" by Arjuna's piece, but her allegiance is tied to all Pandava major pieces.
6.  **The Dice Game:** Pandava pieces are progressively "captured," cornered, or immobilized. Draupadi's piece is threatened. Bhima's piece shows contained power.
7.  **Exile and Reflection:** Key Pandava pieces are off the main "battle" area or in a sparse, contemplative arrangement.
8.  **The Great War (Kurukshetra):** The board is active with many pieces. Rapid, animated moves and captures depict the battles.
9.  **Dushasana's End:** A specific, dramatic "capture" sequence where Bhima's piece takes Dushasana's.
10. **Victory's Burden:** Many pieces removed. Remaining pieces in a somber, sparse configuration.
11. **The Final Journey:** Pieces are removed one by one or transform/ascend. Bhima's piece is among the last, perhaps undergoing a final transformation.

## Interactive Features:

- **Automatic Progression:** The "chess game" automatically transitions through key story events (board states/moves).
- **Scene Slider:** Manually navigate between different story events/board states.
- **Dynamic Atmosphere:** Colors and lighting around the chessboard shift to reflect the emotional tone of each event.
- **Animated Piece Movements:** Observe characters (pieces) move, interact, and get "captured" as the story unfolds.
- **3D Navigation:** Use mouse controls (`orbitControl()`) to rotate, pan, and zoom around the 3D chessboard.
- **Playback Controls:**
  - **Space Bar:** Pause or resume the automatic progression.
  - **R Key:** Reset the visualization to the beginning.

## Thematic Focus

This chess-based visualization emphasizes the strategic elements, moral dilemmas, and the interplay of free will and destiny within _Randamoozham_. Bhima's journey is seen as a path through a complex, often brutal "game," where his strength, loyalty, and rage are key "moves" with profound consequences.

## Technology

Built with [p5.js](https://p5js.org/) for 3D rendering and interactivity in the browser.

## Project Structure

The project is organized into the following files and directories:

- `index.html`: The main HTML file.
- `css/style.css`: CSS styles.
- `js/sketch.js`: Main p5.js sketch for core logic, setup, drawing, and chess game rendering.
- `js/story.js`: Defines `storyEvents` array, containing narrative data, piece positions for each event, and special actions (moves, captures).
- `js/characters.js`: Defines `characterStyles` (chess piece types, sides, visual properties) and initializes `activePieces` array (current board state).
- `README.md`: This file.

## How to Run

1.  Ensure all project files are in the same main directory.
2.  Open `index.html` in a modern web browser that supports WebGL.

## Project Roadmap & To-Do (3D Chess Visualization)

### Phase 1: Conceptualization & Foundational Code (COMPLETED)

- [x] Define 3D Chess Visualization Concept.
- [x] Update `README.md` with new concept, scene breakdown, and roadmap.
- [x] **`js/characters.js`:**
  - Redefine `characterStyles` for chess pieces (e.g., `{ pieceType: 'ROOK', side: 'PANDAVA', modelKey: 'rookPrimitive', color: [r,g,b], baseSize: 50 }`). (Completed, `baseSize` added as an example, actual sizes might vary per piece type).
  - Rename `characterOrbs` array to `activePieces` (or similar) globally; this will store the current state of all pieces on the board (name, type, side, rank, file, visualState). (Completed, `activePieces` is used in `sketch.js`; `characters.js` still has a lingering `characterOrbs = []` at the end which should be removed).
- [x] **`js/story.js`:**
  - Restructure `storyEvents`. Each event will define:
    - `title`, `description`, `focus`, `color`, `intensity`.
    - `boardSetup`: An array of objects, each specifying a character, their piece type, side, and initial `rank` and `file` (or chess notation like "e4") for that scene. E.g., `{ name: "Bhima", position: "e1" }`. (Completed, `story.js` uses `boardSetup` with `name` and `position`. `pieceType` and `side` are derived via `characterStyles`).
    - `specialActions` (optional): Array of actions like `{ type: "move", pieceName: "Bhima", to: "e2" }`, `{ type: "capture", attacker: "Bhima", target: "Dushasana" }`. (Completed, structure for `specialActions` is in place, though specific actions like `pieceName`, `attacker`, `target` need to be consistently used when populating data).
- [x] **`js/sketch.js`:**
  - Globally rename `characterOrbs` to `activePieces`. (Completed).
  - Rename `updateActiveCharacterOrbs` function to `setupBoardForEvent` (or similar). This function will parse `currentEvent.boardSetup` to populate `activePieces`. (Completed, `setupBoardForEvent` now uses `currentEvent.boardSetup`).

### Phase 2: Basic 3D Chess Rendering (PARTIALLY COMPLETED)

- [x] **`js/sketch.js` - Constants & Setup:**
  - Define chessboard constants: `BOARD_SIZE` (e.g., 8 for 8x8), `SQUARE_SIZE` (world units), `BOARD_Y_POSITION` (vertical position of the board).
  - Implement `mapBoardTo3D(boardPosition)` function: Takes chess notation (e.g., "e4") or rank/file object and returns `{x, y, z}` world coordinates for the center of the square. The `y` will likely be `BOARD_Y_POSITION`.
  - Modify `setupBoardForEvent` to use `mapBoardTo3D()` to set `current3DPos` and `target3DPos` for each piece based on its `boardPosition` from `story.js`.
- [x] **`js/sketch.js` - Drawing the Board:**
  - Implement `drawChessboard()` function:
    - Renders the 3D chessboard grid (e.g., using `plane()` or `box()` for squares).
    - Alternating colors for squares (e.g., dark and light grey, or thematic colors).
  - Call `drawChessboard()` in the main `draw()` loop.
- [x] **`js/sketch.js` - Drawing the Pieces:**
  - Implement a function `drawChessPiece(piece)`:
    - Takes a piece object from `activePieces` as input.
    - Renders a basic 3D shape (e.g., `box` for Rook, `cylinder` for King/Queen, `cone` for Bishop, `sphere` for Pawn) based on `piece.pieceType`. Use `piece.color` for fill and `piece.size` (ensure `characterStyles` defines appropriate sizes or have defaults in `drawChessPiece`).
    - Position the piece at `piece.current3DPos.x, piece.current3DPos.y + pieceHeightOffset, piece.current3DPos.z` (offset so it sits on top of the board).
  - In `draw()`, iterate through `activePieces` and call `drawChessPiece()` for each non-captured piece.
  - Adapt Bhima's pulsing visual cue (the central sphere) to his specific chess piece if desired, or remove the generic pulsing sphere.
- [ ] **`js/sketch.js` - Camera & Interaction:**
  - [x] Set up an initial camera angle for good board visibility. (Completed)
  - [x] Ensure `orbitControl()` provides good views of the board and pieces. (Completed)
  - [x] Add rendering of character names near their 3D pieces. (Completed)
  - [ ] Refine readability and position of names to ensure clarity.
- [x] **`js/characters.js`:**
  - Ensure `characterStyles` includes a `baseSize` or specific size for each piece type, or that `drawChessPiece` has default sizes.
  - Remove the unused `let characterOrbs = [];` at the end of the file.
- [x] **`js/story.js`:**
  - Start populating `boardSetup` for the first few `storyEvents` with actual chess positions (e.g., "a1", "h8").
  - Update `specialActions` to use consistent naming for piece identifiers (e.g., `pieceName: "Bhima"` or `targetPiece: "Dushasana"`). The current `action.character` in `sketch.js` needs to be reconciled with this.

### Phase 3: Implementing Event Logic & Animations (IN PROGRESS)

- [ ] **`js/sketch.js`:**
  - Implement logic for smoothly transitioning piece positions when `currentEventIndex` changes (both automatic and slider-driven). This will involve interpolating positions from the previous event's board state to the new one, or executing defined `specialActions`.
  - Animate `specialActions`:
    - `move`: Animate piece from current square to `to` square.
    - `capture`: Animate attacking piece moving, target piece being removed (e.g., fades out, shrinks, or moves off-board).
  - Refine visual cues for piece states (e.g., "highlighted," "threatened," "captured").

### Phase 4: Advanced Visuals & Polish

- [ ] (Optional) Explore loading and rendering simple, distinct 3D models for each chess piece type instead of p5.js primitives.
- [ ] Enhance lighting, and add textures for the board and pieces for a more polished look.
- [ ] Consider adding subtle particle effects for significant moves, captures, or special abilities.
- [ ] Refine UI/UX, including camera behavior for focusing on key interactions.

### Phase 5: Documentation & Finalization

- [ ] Ensure all new code is well-commented.
- [ ] Final review and update of `README.md` and all documentation.
- [ ] Conduct performance testing and optimization.

## Current Status (May 22, 2025)

### Completed

1. **Core Structure and Configuration**:

   - Defined the chess visualization concept and structure
   - Set up the basic 3D environment with p5.js
   - Created character-to-chess-piece mapping in `characters.js`
   - Developed story events with board positions and special actions in `story.js`
   - Implemented slider interaction for navigating through events

2. **3D Chess Environment**:

   - Created the 3D chessboard with alternating colored squares
   - Established the chess notation to 3D position mapping system
   - Implemented initial camera positioning for better board visibility
   - Added orbitControl() for user navigation of the 3D space

3. **Visualization Features**:
   - Implemented detailed chess piece rendering with distinct shapes for each piece type
   - Added character name display above pieces with proper positioning and readability
   - Implemented smooth piece movement animations with lerp interpolation
   - Added piece capture animations (sinking and fading)
   - Implemented the atmosphere-setting pulsing orb (representing Bhima's narrative focus)
   - Created dynamic lighting based on event colors

### Current Improvements

1. **Chess Piece Design**:

   - Created recognizable chess pieces using combinations of p5.js 3D primitives
   - Unique designs for each piece type: Pawn, Rook, Knight, Bishop, Queen, King, Special (Krishna)
   - Each piece has a base color determined by the character representation

2. **Text and Labeling**:

   - Fixed text positioning to clearly display names above pieces
   - Added text outlining for better readability against any background
   - Implemented text rotation to keep labels visible from different camera angles

3. **Animation System**:
   - Added smooth transitions between piece positions with linear interpolation
   - Improved capture animations with sinking and fading effects
   - Adjusted automatic progression timing to allow better viewing of each scene
   - Added temporary disabling of auto-progression after slider use

### Next Steps

1. **Further Visual Refinements**:

   - Add texture mappings to the board and pieces
   - Enhance the lighting system for more dramatic effects
   - Consider adding environmental elements or background

2. **Interaction Enhancements**:

   - Add hover effects or selection capability for pieces
   - Implement highlighting of important pieces based on the current event
   - Consider adding optional explanatory tooltips for scene context

3. **Animation Improvements**:

   - Add more dynamic animations for special actions
   - Implement particle effects for important moments
   - Create smoother transitions between scenes with camera movements

4. **Performance Optimization**:
   - Review rendering performance for smoother animations
   - Optimize lighting and shadow calculations
   - Consider level-of-detail rendering for complex scenes

## How to Run

1. Ensure all project files are in the proper directory structure.
2. Start a local web server to serve the files (e.g., `python3 -m http.server 8000`).
3. Open `http://localhost:8000` in a browser that supports WebGL.
4. Use the slider to navigate between different story events.
5. Use mouse to orbit/rotate the view, scroll to zoom, Space to pause/resume, and R to reset the visualization.
