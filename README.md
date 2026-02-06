# react-coding-challenge
Walkthrough - Refactor and Clean react-coding-challenge
I have completed the refactoring of the react-coding-challenge repository. The goal was to clean up the code, remove repetitive state, and improve the UI/UX.

Changes
1. State Management (
App.jsx
)
Array-based State: Replaced individual lightclass1...lightclass7 state variables with a single bulbs array state [true, true, ...].
Queue Logic: Simplified the queue management. When a bulb is clicked:
If ON: It turns OFF and is added to the queue.
If OFF: It turns ON and is removed from the queue (fixing a potential bug/feature in original logic).
Auto-Turn On: Implemented a useEffect that detects when the queue is full (7 items) and triggers an interval to turn bulbs back on one by one in the order they were turned off.
2. Components (
Bulb.jsx
)
Controlled Component: Refactored 
Bulb
 to be a pure functional component. It now receives isOn and onClick via props.
Removed Logic: Moved all state logic out of the child component into the parent 
App.jsx
.
3. Styling (
App.css
 & 
Bulb.css
)
Flexbox Layout: Added a responsive flexbox layout in 
App.css
 to center the content and arrange bulbs.
Cleaned CSS: Removed float and unnecessary positioning from 
Bulb.css
.
Inline Styles: Removed inline styles from 
App.jsx
.
4. Audio Feedback (
src/utils/audio.js
)
Web Audio API: Implemented a lightweight synthesizer that generates piano tones without external files.
Interaction Sounds:
Clicking: Plays a note from the C-Major scale matching the bulb's position (Do-Re-Mi...).
Restoration: Plays a celebratory chord when restoration starts/ends and plays notes as bulbs turn back on.
5. Responsive UI (
App.css
)
Mobile First: Added media queries to ensure the app looks great on phones and tablets.
Bulbs scale down from 150px to 80px on smaller screens.
Layout adapts to cleaner vertical flow on mobile.
Aesthetics: Added a deep space gradient background, glassmorphism instruction card, and smooth hover/click animations.
Verification Results
Automated Build Verification
Ran npm run build to verify there are no syntax errors or compilation issues.

Result: Build check passed (Exit code 0)
Manual Verification Steps
To verify the changes locally:

Run npm run dev.
Audio: Turn up your volume! Click bulbs to hear the notes.
Responsive: Resize your browser window to mobile size. Verify the bulbs shrink and the layout adjusts.
Game Loop: Turn off all 7 bulbs. Listen for the completion chord and watch/listen to the restoration sequence.
Next Steps
Run the app and enjoy the improved code quality!
9. Visual Polish
Celebration: Integrated canvas-confetti to trigger a colorful particle explosion on victory.
Color Palette: Softened neon colors to pastel shades (#50c5ff, #ff70c5) for a cleaner look.
Interaction: Removed harsh white click borders; replaced with a soft glow for keyboard focus.
10. Gameplay Balancing
Reduced Complexity: Simplified the grid from 7 to 5 bulbs to improve flow and reducing cognitive load.
Confetti Fix: Ensured the celebration triggers reliably by hooking into the state change lifecycle.
