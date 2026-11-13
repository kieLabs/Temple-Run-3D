TEMPLE RUN 3D — JUNGLE ESCAPE (GAMERKIE)
========================================

GitHub Pages-ready 3D endless runner.

STARTUP FIX
- Removed THREE.CapsuleGeometry dependency (it is not in the Three.js r128
  core CDN build). Runner body and limbs are now assembled from compatible
  cylinder and sphere meshes.
- Added a jsDelivr fallback if the primary Three.js CDN does not load.
- Added an on-screen initialization error notice for WebGL/engine failures.

UPLOAD TO GITHUB
1. Extract this ZIP.
2. Upload the CONTENTS (index.html, style.css, .nojekyll, README.txt, js/)
   directly into the ROOT of your game repository. Do not upload the ZIP itself.
3. GitHub Settings -> Pages -> Deploy from a branch -> main -> /(root).
4. Save, then open https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
5. Hard refresh after deployment (Ctrl+Shift+R on desktop).

CONTROLS
Desktop: Left/Right arrows or A/D to change lanes; Up/Space/W to jump;
Down/S to slide; Escape pauses/resumes.
Mobile: swipe left/right/up/down or use on-screen controls.

NOTES
- Three.js r128 loads from CDN with a jsDelivr fallback; internet is required.
- Environment, runner, coins and obstacles are procedural 3D models with
  physically based materials, shadows and real-time lighting.
- Use a modern browser with WebGL enabled.
