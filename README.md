**Description:**
This project is a 3D visualization tool for beacon data using React, TypeScript, and Three.js. The visualization displays beacon movements, including position, orientation, and acceleration, in real-time using data parsed from a text file. Users can interact with the 3D scene, and the tool dynamically updates based on incoming beacon data.

---

## **List of Libraries and Dependencies**

1. **React**  
   Used in almost every file that involves JSX or React hooks. The core library used for building the front-end and managing the user interface in a component-based structure.  
   **Purpose:** Handles rendering, state management, and user interactions.

2. **TypeScript**  
   The presence of TypeScript is implied in files like `parsing.ts` and `App.tsx`, adding static typing to the JavaScript code. TypeScript is providing type safety and enhancing code quality across these files.
   **Purpose:** Provides static types for the project, making development smoother and safer.

3. **Three.js**  
   Three.js is used throughout the project, particularly in 3D rendering and object manipulation.  
   **Purpose:** Renders 3D objects like the cube, Earth, and stars in the scene.

4. **FBXLoader**  
   FBXLoader is used in `orbit.js` to load 3D models in FBX format, particularly the satellite model  
   **Purpose:** Allows us to load 3D models into the scene (e.g., satellite models in this project).

5. **OrbitControls**  
   A module from Three.js for controlling the 3D camera view with zoom and rotation functionality.  
   **Purpose:** OrbitControls is used in both `orbit.js` and `globe.js`. It enables users to zoom and rotate the camera around objects.

6. **ShaderMaterial**  
   ShaderMaterial is used in `getFresnelMat.js` to create a custom Fresnel effect, which adds glowing outlines around 3D objects. 
   **Purpose:** Implements the Fresnel material effect for glowing outlines on 3D objects.

---

## **Code and Corresponding Requirements**

### **1. Data Parsing**

**File:** `parsing.ts`  
**Description:** This file contains the `parseBeaconMessage` function, which extracts relevant data (position, orientation, and timestamp) from each beacon message. The function parses the raw message and converts it into a structured format for further use.  
**Requirement Addressed:** Meets the requirement to implement a function that extracts the beacon's position, orientation, and timestamp.

---

### **2. Visualization**

**Files:**  
 `testScene.tsx`  
 `App.tsx`  
 `orbit.js`  
 `globe.js`  

**Description:**  
- **ThreeScene.tsx**: Responsible for rendering the 3D scene using Three.js. The position, rotation, and acceleration are updated based on the beacon data. The cube represents the beacon in the 3D scene.  
- **App.tsx**: Manages the user interface, allowing users to switch between data views (position, orientation, acceleration). The component dynamically updates based on the selected data view and refreshes in real time as new beacon messages are processed.

**Sub-requirements:**
- (a) The cube’s rotation is updated according to the beacon’s yaw, pitch, and roll values to represent the beacon's orientation.  
- (b) The cube’s position is dynamically updated based on the beacon’s latitude, longitude, and altitude, representing the real-time movement of the beacon.  
- (c) The 3D scene updates in real-time as new messages are received, showing the continuous movement and state of the beacon.  
- (d) Visual representation of both position and orientation, based on the incoming beacon data, is included.

**Files Referenced:**
 `orbit.js`: Handles the rendering of the satellite and Earth model, including updating satellite position and rotation based on beacon data.  
 `globe.js`: Handles the rendering of Earth and its associated visuals, including atmosphere and clouds.  
 `getStarfield.js`: Generates the background starfield to enhance the 3D scene's appearance.  
 `getFresnelMat.js`: Implements the Fresnel material effect for visual glow.

---

### **3. User Interaction**

**Files:**  
 `testScene.tsx`  
 `App.tsx`  
 `orbit.js`  

**Description:** The project uses `OrbitControls` from `@react-three/drei` to allow users to rotate and zoom the 3D visualization of the beacon. The user can switch between views (position, orientation, or acceleration) using buttons, which update the visualization based on the selected view.  
**Requirement Addressed:** This satisfies the requirement of user interaction, enabling them to manipulate the 3D scene and switch between different data views.

---

### **4. Real-Time Updates**

**Files:**  
 `App.tsx`  

**Description:** The real-time updates are handled by iterating over the beacon messages and updating the visualization at regular intervals (every 2 seconds). The tool uses the `useEffect` hook to schedule updates using `setInterval`. Each time the interval is triggered, the current message index is updated to show the next beacon message.  
**Requirement Addressed:** The `useEffect` hook starts an interval that iterates over the beacon messages every 2 seconds. When a new message is available, the tool updates the current message index (`currentMessageIndex`) to display the next message. Once all the messages have been processed, the interval is cleared, preventing further updates.

