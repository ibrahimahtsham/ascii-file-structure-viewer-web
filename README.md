# ASCII File Structure Viewer

A modern web application built with React and Vite that visualizes project file structures with ASCII art and provides comprehensive code statistics. Perfect for documenting projects, analyzing codebases, and understanding project organization at a glance.

## ✨ Features

- **📁 Local Folder Analysis**: Upload and analyze local project folders
- **🔗 GitHub Repository Analysis**: Directly analyze public GitHub repositories
- **🌳 ASCII Tree Visualization**: Generate beautiful ASCII art representations of file structures
- **📊 Code Statistics**: Get detailed insights about your codebase including:
  - Total files and lines of code
  - File type distribution
  - Largest files identification
  - Processing time metrics
- **🎨 Interactive Tree Controls**:
  - Toggle file sizes and line counts
  - Color-coded file types and sizes
  - Ignore/exclude files and folders from output
- **📋 Copy to Clipboard**: Easy copying of ASCII trees for documentation
- **🌙 Dark/Light Theme**: Modern UI with theme switching
- **⚡ Real-time Progress**: Live progress tracking during file processing
- **🔍 Smart File Filtering**: Automatically handles binary files and large files

## 🚀 Live Demo

Visit the live application: [ASCII File Structure Viewer](https://your-deployed-url.com)

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Beautiful and accessible UI components
- **GitHub API** - Direct repository analysis
- **File API** - Local file system access

## 📦 Installation & Quick Start

### Using the Helper Scripts (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ascii-file-structure-viewer-web.git
cd ascii-file-structure-viewer-web
```

2. Run the appropriate script for your system:

**Windows:**

```bash
run_script.bat
```

**Linux/macOS:**

```bash
chmod +x run_script.sh
./run_script.sh
```

The script will automatically:

- Install dependencies if this is your first run
- Provide a menu with options to:
  1. Start the development server
  2. Deploy to GitHub Pages
  3. Run linting and dependency checks

### Manual Installation

If you prefer to install manually:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ascii-file-structure-viewer-web.git
cd ascii-file-structure-viewer-web
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Local Folder Analysis

1. Click "Select Project Folder"
2. Choose a folder from your computer
3. Select which files to include/exclude
4. View the generated ASCII tree and statistics

### GitHub Repository Analysis

1. Enter a GitHub repository URL (e.g., `facebook/react` or `https://github.com/facebook/react`)
2. The app will automatically fetch and analyze the repository
3. Customize the output with various display options

### Customization Options

- **Show File Sizes**: Display file sizes in the ASCII tree
- **Show Line Counts**: Include line counts for code files
- **Color Coding**: Enable color-coded visualization
- **Ignore Files**: Exclude specific files or folders from the output

## 📂 Project Structure

```
src/
├── components/
│   ├── AsciiTree/          # ASCII tree visualization components
│   ├── CodeStats.jsx       # Code statistics display
│   ├── FileTreeViewer/     # Interactive file tree viewer
│   └── ThemeToggle.jsx     # Dark/light theme switcher
├── pages/
│   └── Home/               # Main application page
├── utils/
│   └── fileProcessor/      # File processing and analysis utilities
├── theme/                  # Material-UI theme configuration
└── App.jsx                 # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint
- `npx depcheck` - Check for unused dependencies

Or use the helper scripts:

- **Windows**: `run_script.bat`
- **Linux/macOS**: `./run_script.sh`

## 🔧 Configuration

The application supports various configuration options:

- **File Size Limits**: Configurable maximum file sizes for processing
- **Supported Extensions**: Customizable list of supported file types
- **GitHub API**: Built-in rate limiting and error handling
- **Processing Options**: Batch processing with progress tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Private repository support with authentication
- [ ] Export options (PDF, PNG, SVG)
- [ ] Custom styling options for ASCII trees
- [ ] Comparison mode for multiple repositories
- [ ] Integration with popular code hosting platforms
- [ ] API for programmatic access

## 🐛 Known Issues

- Large repositories may take some time to process
- GitHub API rate limits apply (60 requests per hour for unauthenticated users)
- Some binary files may not be properly detected

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- UI components from [Material-UI](https://mui.com/)
- GitHub API for repository access
- Icons from [Material Icons](https://fonts.google.com/icons)
