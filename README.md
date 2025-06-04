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
- **⚠️ Rate Limit Monitoring**: Real-time GitHub API rate limit tracking and warnings

## 📸 Screenshots

### Main Interface

![image](https://github.com/user-attachments/assets/8c3257f7-6fba-4489-b314-37a047be2dd6)
_Upload local folders or analyze GitHub repositories with an intuitive interface_

### File Tree Viewer

![image](https://github.com/user-attachments/assets/1946ec92-7c6c-4a98-9118-db6b56988425)
_Interactive file tree with ignore/include controls and detailed file information_

### ASCII Tree Output

![image](https://github.com/user-attachments/assets/364b392f-cd3c-43b9-a48e-d1dba23befc7)
_Beautiful ASCII art representation with customizable display options_

### Code Statistics

![image](https://github.com/user-attachments/assets/dadee87e-9433-4197-838d-69b901411d7b)
_Comprehensive code analysis with file type distribution and metrics_

### GitHub Repository Analysis

![image](https://github.com/user-attachments/assets/c02962b4-ad50-4db7-b6f2-68748249ddea)
_Direct GitHub repository analysis with rate limit monitoring_

## 🚀 Live Demo

Visit the live application: [ASCII File Structure Viewer](https://ibrahimahtsham.github.io/ascii-file-structure-viewer-web/)

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Beautiful and accessible UI components
- **GitHub API** - Direct repository analysis with rate limiting
- **File API** - Local file system access

## 📦 Installation & Quick Start

### Using the Helper Scripts (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/ibrahimahtsham/ascii-file-structure-viewer-web.git
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
git clone https://github.com/ibrahimahtsham/ascii-file-structure-viewer-web.git
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
3. Monitor rate limit usage in real-time
4. Customize the output with various display options

### GitHub API Rate Limits

- **Unauthenticated**: 60 requests per hour
- **With Personal Access Token**: 5,000 requests per hour (coming soon)
- Real-time rate limit monitoring shows remaining requests
- Automatic delays when approaching limits

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
│       ├── components/
│       │   ├── GithubSection.jsx     # GitHub repository input
│       │   └── ProgressSection/      # Progress tracking components
│       ├── hooks/
│       │   └── useFileProcessor.js   # File processing logic
│       └── utils/
│           └── github/
│               └── GitHubAPI/        # GitHub API integration
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

- **File Size Limits**: Configurable maximum file sizes for processing (1MB default for GitHub files)
- **Supported Extensions**: Comprehensive list of supported file types with MIME type detection
- **GitHub API**: Built-in rate limiting, error handling, and progress tracking
- **Processing Options**: Batch processing with real-time progress updates

## 📋 Roadmap

### 🔜 Coming Soon

- [ ] **GitHub Authentication** - Sign in with GitHub for 5,000 requests/hour
- [ ] **Private Repository Support** - Access private repositories with authentication
- [ ] **Enhanced Rate Limit Management** - Better handling of API quotas
- [ ] **Repository Caching** - Cache analyzed repositories to reduce API calls

### 🚀 Future Features

- [ ] **Export Options** - PDF, PNG, SVG export of ASCII trees
- [ ] **Custom Styling** - Personalize ASCII tree appearance
- [ ] **Comparison Mode** - Compare multiple repositories side-by-side
- [ ] **API Integration** - REST API for programmatic access
- [ ] **Collaboration Features** - Share and collaborate on repository analyses
- [ ] **Advanced Filtering** - More sophisticated file filtering options

### 🔧 Technical Improvements

- [ ] **Performance Optimization** - Faster processing for large repositories
- [ ] **Better Binary Detection** - Improved binary file handling
- [ ] **Progressive Loading** - Stream results as they're processed
- [ ] **Offline Mode** - Work with previously analyzed repositories offline

## 🔑 GitHub Authentication (Coming Soon)

To increase your API rate limit from 60 to 5,000 requests per hour:

1. **Sign in with GitHub** - Use OAuth to authenticate
2. **Generate Personal Access Token** - Create a token with repository access
3. **Enhanced Features** - Access private repositories and higher rate limits

**Benefits of Authentication:**

- 🚀 **83x more API requests** (5,000 vs 60 per hour)
- 🔒 **Private repository access**
- 📊 **Better rate limit management**
- ⚡ **Faster repository analysis**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Large repositories may take time to process due to API rate limits
- GitHub API rate limits apply (60 requests/hour for unauthenticated users)
- Some binary files may not be properly detected
- Very deep directory structures may hit recursion limits

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- UI components from [Material-UI](https://mui.com/)
- GitHub API for repository access with comprehensive rate limiting
- Icons from [Material Icons](https://fonts.google.com/icons)
- Real-time progress tracking and error handling

## 📞 Support

If you have any questions or need help, please:

- 🐛 **Report Issues**: [Open an issue on GitHub](https://github.com/ibrahimahtsham/ascii-file-structure-viewer-web/issues)
- 📖 **Documentation**: Check our [Wiki](https://github.com/ibrahimahtsham/ascii-file-structure-viewer-web/wiki)
- 📧 **Direct Contact**: Reach out to the maintainers
