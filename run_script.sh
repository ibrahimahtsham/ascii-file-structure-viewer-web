#!/bin/bash
# filepath: run_script.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Check if dependencies are already installed
if [ ! -d "node_modules" ]; then
    print_color $YELLOW "First run detected. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_color $RED "Failed to install dependencies."
        exit 1
    fi
    print_color $GREEN "Dependencies installed successfully!"
fi

# Main menu function
show_menu() {
    echo ""
    print_color $BLUE "Choose an option:"
    echo "1) Start dev server (npm run dev)"
    echo "2) Deploy to GitHub Pages (npm run deploy)"
    echo "3) Run lint and depcheck"
    echo "4) Exit"
    echo -n "Enter your choice [1-4]: "
}

# Main menu loop
while true; do
    show_menu
    read choice
    
    case $choice in
        1)
            print_color $YELLOW "Starting dev server..."
            npm run dev
            break
            ;;
        2)
            print_color $YELLOW "Deploying to GitHub Pages..."
            npm run deploy
            if [ $? -eq 0 ]; then
                print_color $GREEN "Successfully deployed to GitHub Pages!"
                print_color $BLUE "Opening GitHub Actions in your default browser..."
                sleep 3
                # Try to open in browser (works on most Linux distros and macOS)
                if command -v xdg-open > /dev/null; then
                    xdg-open "https://github.com/ibrahimahtsham/ascii-file-structure-viewer-web/actions/"
                elif command -v open > /dev/null; then
                    open "https://github.com/ibrahimahtsham/ascii-file-structure-viewer-web/actions/"
                else
                    print_color $YELLOW "Please manually open: https://github.com/ibrahimahtsham/ascii-file-structure-viewer-web/actions/"
                fi
            else
                print_color $RED "Deployment failed."
            fi
            break
            ;;
        3)
            print_color $YELLOW "Running ESLint..."
            npm run lint
            echo ""
            print_color $YELLOW "Running depcheck..."
            npx depcheck
            break
            ;;
        4)
            print_color $GREEN "Goodbye!"
            exit 0
            ;;
        *)
            print_color $RED "Invalid option. Please choose 1, 2, 3, or 4."
            ;;
    esac
done