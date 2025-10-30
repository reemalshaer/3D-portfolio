# 3D Portfolio - Interactive Desk Setup

An interactive 3D portfolio built with Three.js and Vite, featuring a desk setup with a laptop that users can click to zoom in and explore.

## Features

- **Interactive 3D Scene**: Navigate around a 3D desk setup with orbital controls
- **Click-to-Zoom**: Click on the desk to zoom into the laptop view
- **Portfolio Sections**: Interactive buttons for About Me, Projects, Skills, and Contact
- **Smooth Animations**: Camera transitions with easing for a polished experience
- **Responsive Design**: Works on different screen sizes
- **Modern Stack**: Built with Vite for fast development and Three.js for 3D graphics

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3D-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Navigate**: Use your mouse to rotate around the desk setup
2. **Zoom**: Scroll to zoom in/out when in default view
3. **Interact**: Click anywhere on the desk setup to zoom into the laptop
4. **Explore**: Click on the buttons (About Me, Projects, Skills, Contact) to view content
5. **Return**: Click "Back to Desk" to zoom out to the original view

## Project Structure

```
3D-portfolio/
├── index.html          # Main HTML file
├── package.json        # Project dependencies
├── src/
│   ├── main.js        # Three.js application code
│   └── style.css      # Styling
└── public/            # Static assets (if needed)
```

## Technologies Used

- **Three.js**: 3D graphics library
- **Vite**: Fast build tool and dev server
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with animations

## Customization

### Update Content

Edit the `contentData` object in `src/main.js` to customize the portfolio content:

```javascript
const contentData = {
  about: { title: 'About Me', content: '...' },
  projects: { title: 'Projects', content: '...' },
  // ... add more sections
};
```

### Modify 3D Models

The desk, laptop, and lamp are created with Three.js primitives. You can modify their geometry, materials, and positions in `src/main.js`:

- Desk: Lines 67-91
- Laptop: Lines 96-145
- Lamp: Lines 148-177

### Adjust Camera Positions

Change the camera positions for zoomed in/out states:

```javascript
const originalCameraPosition = new THREE.Vector3(0, 5, 10);
const zoomedCameraPosition = new THREE.Vector3(0, 1.5, 2.5);
```

## License

MIT

## Credits

Created with Three.js and Vite
