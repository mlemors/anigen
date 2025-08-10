# AniGen - Anime Image Viewer

A modern, responsive web-based anime image viewer built with Astro, featuring multiple API sources, smart preloading, and intuitive navigation controls.

![AniGen Screenshot](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=AniGen+Anime+Viewer)

## ✨ Features

### �️ **Multi-Source Image Loading**
- **6 Anime APIs**: Waifu.im, Waifu.pics, Nekos.moe, Nekos API, Nekos.best, Nekos.life
- **Source Switching**: Easy dropdown to switch between different image sources
- **Smart Fallbacks**: Automatic error handling and retry logic

### 🚀 **Performance & UX**
- **Smart Preloading**: Background loading system for instant image switching
- **Image Scaling**: Automatic upscaling for small GIFs and images
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Glass-morphism UI**: Modern design with backdrop blur effects

### 🎮 **Navigation & Controls**
- **Keyboard Shortcuts**:
  - `A` / `←` - Previous image
  - `D` / `→` - Next image / Load new
  - `W` - Enter fullscreen mode
  - `S` - Exit fullscreen mode
  - `F` - Download current image
- **Touch Support**: Swipe gestures for mobile navigation
- **Mouse Support**: Click and drag for desktop swipe simulation

### 📊 **Rich Metadata Display**
- **Image Information**: Displays anime name, character, artist, dimensions
- **File Details**: Shows file size, format, and tags when available
- **Smart Categories**: Category-based browsing with visual indicators
- **Temporary Overlay**: Non-intrusive metadata display that auto-hides

### 🎨 **Visual Design**
- **Dark Theme**: Sleek black background with gradient accents
- **Purple-Cyan Gradient**: Consistent color scheme throughout the UI
- **Animated Elements**: Smooth transitions and hover effects
- **Mobile-First**: Optimized for touch devices with responsive layouts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/mlemors/mlemors-anigen.git
cd mlemors-anigen

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to start browsing anime images!

## 🛠️ Development

### Project Structure

```text
mlemors-anigen/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro        # Global styles and layout
│   ├── pages/
│   │   └── index.astro         # Main application page
│   └── services/
│       └── imageApis.ts        # API service layer
├── package.json
└── README.md
```

### Available Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

### Adding New Image Sources

To add a new anime image API:

1. Add the source to the `ImageSource` enum in `imageApis.ts`
2. Create a fetch method following the existing pattern
3. Add the case to the `fetchImageFromSource` switch statement
4. Add the display name to `getSourceDisplayName`

## 🎯 Usage Guide

### Basic Navigation
1. **Load Images**: Click the ⏩ button or press `D` to load new images
2. **Browse History**: Use ⏪ button or press `A` to go back to previous images
3. **Change Sources**: Click the source dropdown to switch between different APIs
4. **Fullscreen**: Press `W` to enter fullscreen mode, `S` to exit

### Advanced Features
- **Download**: Press `F` or click ❤️ to download the current image
- **External View**: Click 🔗 to open the image in a new tab
- **Swipe Navigation**: On mobile, swipe left/right to navigate
- **Auto-Hide UI**: Interface elements fade out in fullscreen mode

## 🔧 Technical Details

### Built With
- **Astro 5.12.9** - Static site generator
- **TypeScript** - Type-safe development
- **Vanilla JavaScript** - No heavy frameworks, just fast DOM manipulation
- **CSS3** - Modern styling with flexbox, gradients, and animations

### API Integration
The app integrates with multiple anime image APIs:
- **Waifu.im**: High-quality images with rich metadata
- **Waifu.pics**: Category-based anime images
- **Nekos.moe**: Community-driven neko images
- **Nekos.best**: Reliable anime character images
- **Nekos.life**: Long-running anime API
- **Nekos API**: Alternative neko source

### Performance Features
- **Smart Caching**: Maintains a pool of 3 preloaded images
- **Background Loading**: Non-blocking image fetching
- **Error Recovery**: Graceful handling of API failures
- **Memory Management**: Automatic cleanup of old images

## � Browser Support

- **Chrome/Edge**: Full support with all features
- **Firefox**: Full support with all features
- **Safari**: Full support with all features
- **Mobile Browsers**: Touch gestures and responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GPL v3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Astro Team** - For the amazing static site generator
- **API Providers** - All the anime image API services that make this possible
- **Community** - For inspiration and feedback

## 🐛 Issues & Support

If you encounter any issues or have suggestions:
1. Check existing [Issues](https://github.com/mlemors/mlemors-anigen/issues)
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

---

## License
```
Copyright © 2025 mlemors. All rights reserved.

mlemors-Astro is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

mlemors-Astro is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with mlemors-Astro. If not, see <https://www.gnu.org/licenses/>.
```

Made with ❤️ and **Astro** by [mlemors](https://github.com/mlemors)
