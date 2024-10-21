#!/bin/bash

# Check for Homebrew and install if not found
if ! command -v brew &> /dev/null
then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew is already installed."
fi

# Add Homebrew to the path based on system architecture
if [[ $(uname -m) == "arm64" ]]; then
    # For Apple Silicon (M1/M2)
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    # For Intel Macs
    eval "$(/usr/local/bin/brew shellenv)"
fi

# Install Git if not installed
if ! command -v git &> /dev/null
then
    echo "Git not found. Installing Git..."
    brew install git
else
    echo "Git is already installed."
fi

# Install Node.js if not installed
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing Node.js..."
    brew install node
else
    echo "Node.js is already installed."
fi

# Install json-server globally if not installed
if ! command -v json-server &> /dev/null
then
    echo "json-server not found. Installing json-server..."
    npm install -g json-server
else
    echo "json-server is already installed."
fi

# Install http-server globally if not installed
if ! command -v http-server &> /dev/null
then
    echo "http-server not found. Installing http-server..."
    npm install -g http-server
else
    echo "http-server is already installed."
fi

# Clone the API repository
read -p "Enter the directory where you want to clone the API repository: " api_dir

# Check if directory exists, create if not
if [ ! -d "$api_dir" ]; then
    mkdir -p "$api_dir"
fi

cd "$api_dir"

# Clone the API repository if not already cloned
if [ ! -d "$api_dir/api_jsa37" ]; then
    echo "Cloning the API repository..."
    git clone https://github.com/BuiThang652/api_jsa37.git
fi

# Navigate to the cloned API directory
cd api_jsa37

# Install dependencies (json-server and any other required packages)
echo "Installing API dependencies..."
npm install

# Start the json-server
echo "Starting the API server using json-server..."
json-server --watch db.json --port 3000 &

echo "API server is running on http://localhost:3000"

# Ask the user for the path to the website source code
read -p "Enter the directory where your website's source code is located: " website_dir

# Check if the directory exists for the website
if [ -d "$website_dir" ]; then
    echo "Starting the web server..."
    cd "$website_dir"
    http-server -p 8080 & # Start http-server on port 8080 in the background
    echo "Web server is running at http://localhost:8080"
else
    echo "Website directory does not exist. Please provide a valid path."
fi

# Verify installations
echo "Checking installed versions..."
brew --version
node --version
git --version
json-server --version
http-server --version

echo "Installation complete! Both the web server and API server are up and running."
