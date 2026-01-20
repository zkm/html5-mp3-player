# HTML5 MP3 Player

A modern, Winamp-inspired web-based MP3 player built with vanilla HTML5, CSS, and JavaScript. This application streams audio files from an AWS S3 bucket and features an interactive visualizer, playback controls, and a track selection dropdown.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Browser Compatibility](#browser-compatibility)
- [License](#license)

## Features

- **Winamp-Inspired UI**: Retro aesthetic with modern functionality
- **Audio Visualizer**: Real-time frequency visualization using the Web Audio API
- **Track Selection**: Dropdown menu to select from 9 pre-loaded tracks
- **Playback Controls**: Play, pause, stop, next, and previous buttons
- **Time Display**: Current playback time in MM:SS format
- **Cross-Origin Support**: CORS enabled for seamless AWS S3 streaming
- **Responsive Design**: Works across modern browsers
- **Containerized**: Docker and Docker Compose ready for easy deployment

## Project Structure

```
html5-mp3-player/
├── index.html              # Main HTML file with player UI
├── css/
│   └── style.css          # Styling for the Winamp-like interface
├── js/
│   └── player.js          # Core player logic and Web Audio API integration
├── audio/                  # Local audio files (optional)
├── Dockerfile              # Docker configuration for nginx deployment
├── docker-compose.yml      # Docker Compose setup
├── README.md               # This file
└── LICENSE                 # License information
```

## Requirements

### For Local Development
- A modern web browser with HTML5 Audio API support
- Web Audio API support for the visualizer feature
- Internet connection for AWS S3 access

### For Docker Deployment
- Docker Engine 20.10+
- Docker Compose 1.29+

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/zkm/html5-mp3-player.git
   cd html5-mp3-player
   ```

2. **Start a local web server**
   
   Using Python 3:
   ```bash
   python3 -m http.server 8000
   ```
   
   Using Node.js with http-server:
   ```bash
   npx http-server -p 8000
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   
   Navigate to `http://localhost:8000` in your web browser

## Usage

### Basic Playback

1. **Select a Track**: Use the track dropdown menu to choose a song
2. **Play**: Click the "Play" button to start playback
3. **Pause**: Click "Pause" to pause the current track
4. **Stop**: Click "Stop" to stop playback and reset the position
5. **Navigate**: Use "Next" and "Prev" buttons to move through the playlist

### Visualizer

The audio visualizer displays a real-time frequency spectrum representation of the currently playing audio. It:
- Shows frequency bars that respond to audio intensity
- Uses colors that shift based on frequency intensity (red-dominant color scheme)
- Runs continuously while the player is active

### Keyboard Controls

Currently, the player uses mouse/click controls. The button controls are:
- **Play Button**: Resumes playback
- **Pause Button**: Pauses playback
- **Stop Button**: Stops playback and resets position to 0:00
- **Next Button**: Skips to the next track
- **Prev Button**: Goes to the previous track

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start the container**
   ```bash
   docker-compose up --build
   ```

2. **Access the player**
   
   Open `http://localhost:8888` in your browser

3. **Stop the container**
   ```bash
   docker-compose down
   ```

### Using Docker Directly

1. **Build the image**
   ```bash
   docker build -t html5-mp3-player .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 8888:80 --name mp3-player html5-mp3-player
   ```

3. **Access the player**
   
   Open `http://localhost:8888` in your browser

4. **Stop the container**
   ```bash
   docker stop mp3-player
   docker rm mp3-player
   ```

## Configuration

### Audio Source

The player sources audio from an AWS S3 bucket. To modify the tracks, edit the `<select>` element in `index.html`:

```html
<select id="trackSelect" class="track-select">
    <option value="https://your-bucket.s3.amazonaws.com/path/to/track.mp3">Track Name</option>
</select>
```

### S3 Bucket Setup

Ensure your S3 bucket has:
- **Public Read Access**: Make objects readable by the web
- **CORS Configuration**: 
  ```xml
  <CORSConfiguration>
    <CORSRule>
      <AllowedOrigin>*</AllowedOrigin>
      <AllowedMethod>GET</AllowedMethod>
      <MaxAgeSeconds>3000</MaxAgeSeconds>
      <AllowedHeader>*</AllowedHeader>
    </CORSRule>
  </CORSConfiguration>
  ```

### Port Configuration

The Docker container runs on port 8888 by default. To change it:
- Edit `docker-compose.yml` and update the port mapping

### Styling

The player uses a retro Winamp-inspired design defined in `css/style.css`. Key CSS classes:
- `.winamp-container`: Main player container
- `.winamp-display`: Track info and visualizer area
- `.winamp-controls`: Button controls section
- `.winamp-playlist`: Track selection dropdown

## Architecture

### Frontend Technologies

- **HTML5**: Semantic structure with audio element
- **CSS3**: Styling with flexbox layout
- **Vanilla JavaScript**: No dependencies required

### Web APIs Used

- **HTML5 Audio API**: Audio playback control
- **Web Audio API**: Real-time audio analysis and visualization
- **Canvas API**: Visualizer rendering

### Core Components

1. **Audio Player**: Native HTML5 `<audio>` element for playback
2. **Analyser Node**: Web Audio API node for frequency analysis
3. **Canvas Visualizer**: Real-time frequency bar visualization
4. **Control Handlers**: Event listeners for all player buttons

### Audio Context

The Web Audio API context is lazily initialized on first interaction to comply with browser autoplay policies. The AudioContext is resumed when:
- Play button is clicked
- A track is selected from the dropdown
- Audio playback starts

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 25+ | ✅ Full | Excellent support for all features |
| Firefox 25+ | ✅ Full | Excellent support for all features |
| Safari 14+ | ✅ Full | WebKit audio context supported |
| Edge 79+ | ✅ Full | Chromium-based, excellent support |
| Internet Explorer | ❌ None | No Web Audio API support |
| Mobile Chrome | ✅ Full | Requires user interaction to play |
| Mobile Safari | ✅ Full | Requires user interaction to play |

## Troubleshooting

### Audio Won't Play

- Ensure your S3 bucket has proper CORS configuration
- Check browser console for CORS errors
- Verify S3 URLs are accessible and properly formatted
- Some browsers require user interaction before audio can play

### Visualizer Not Showing

- Check that the browser supports the Web Audio API
- Ensure JavaScript is enabled
- Verify the canvas element is rendered

### Docker Container Won't Start

- Ensure port 8888 is not already in use
- Check Docker daemon is running
- Review Docker logs: `docker-compose logs`

## Performance Considerations

- The visualizer uses `requestAnimationFrame` for smooth 60fps rendering
- Audio streaming is handled by the browser's native audio buffer
- CORS headers are set in the nginx configuration for efficient streaming
- The FFT size is set to 256 for a balance between detail and performance

## Security Notes

- S3 bucket URLs are publicly accessible (as designed for streaming)
- CORS is enabled for all origins in Docker configuration
- No sensitive data is stored or transmitted by the player
- For production use, consider restricting CORS to specific domains

## Future Enhancements

- Keyboard shortcuts for controls
- Volume control slider
- Shuffle and repeat modes
- Local file upload support
- Equalizer controls
- Favorites/bookmarking
- Playlist management
- Mobile gesture controls

## License

This project is provided under the License specified in the LICENSE file. See [LICENSE](LICENSE) for details.
