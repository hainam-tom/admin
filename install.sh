#!/bin/bash

# Function to install Homebrew if not installed
install_homebrew() {
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [[ $(uname -m) == "arm64" ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    echo "Homebrew installation complete!"
}

# Function to display a message using dialog
show_message() {
    dialog --msgbox "$1" 10 60
}

# Function to get user input using dialog
get_input() {
    dialog --inputbox "$1" 10 60 "$2" 3>&1 1>&2 2>&3
}

# Function to install a package and handle errors
install_package() {
    local package_name="$1"
    local install_command="$2"
    
    if ! command -v "$package_name" &> /dev/null; then
        show_message "$package_name not found. Installing $package_name now..."
        eval "$install_command"
        if [ $? -eq 0 ]; then
            show_message "$package_name installation complete!"
        else
            show_message "Failed to install $package_name. Please check the error messages."
        fi
    else
        show_message "$package_name is already installed. Skipping installation."
    fi
}

# Function to clone a Git repository
clone_repository() {
    local repo_url="$1"
    local target_dir="$2"
    
    if [ ! -d "$target_dir" ]; then
        show_message "Cloning repository from $repo_url..."
        git clone "$repo_url" "$target_dir"
        if [ $? -eq 0 ]; then
            show_message "Repository cloned successfully."
        else
            show_message "Failed to clone the repository. Please check the error messages."
        fi
    else
        show_message "Directory $target_dir already exists. Skipping cloning."
    fi
}

# Function to start servers
start_servers() {
    # Start the API server
    show_message "Starting the API server using json-server on port $api_port..."
    json-server --watch "$api_dir/api_jsa37/db.json" --port "$api_port" &

    # Start the web server
    if [ -d "$website_dir" ]; then
        show_message "Starting the web server (http-server) on port $web_port..."
        cd "$website_dir" || { show_message "Failed to navigate to the website directory."; exit 1; }
        http-server -p "$web_port" &
    else
        show_message "Website directory does not exist. Please provide a valid path."
        exit 1
    fi
}

# Cleanup function to kill background processes
cleanup() {
    pkill -f json-server
    pkill -f http-server
    show_message "Cleanup completed. All servers have been stopped."
}

# Main script execution
{
    # Check for Homebrew and install if not found
    if ! command -v brew &> /dev/null; then
        install_homebrew
    else
        show_message "Homebrew is already installed."
    fi

    # Use dialog after Homebrew installation
    dialog --title "Setup Script" --msgbox "Welcome to the automatic setup script! This will install Git, Node.js, json-server, and http-server, and run both a web server and an API server." 10 60

    # Install necessary packages
    install_package "git" "brew install git"
    install_package "node" "brew install node"
    install_package "json-server" "npm install -g json-server"
    install_package "http-server" "npm install -g http-server"

    # Ask for the API repository directory
    api_dir=$(get_input "Enter the directory where you want to clone the API repository:" "$HOME/api_jsa37")

    # Check if directory exists, create if not
    if [ ! -d "$api_dir" ]; then
        mkdir -p "$api_dir"
        show_message "Created directory: $api_dir"
    fi

    # Clone the API repository
    clone_repository "https://github.com/BuiThang652/api_jsa37.git" "$api_dir/api_jsa37"

    # Navigate to the cloned API directory and install dependencies
    cd "$api_dir/api_jsa37" || { show_message "Failed to navigate to the API directory."; exit 1; }
    show_message "Installing API dependencies..."
    npm install

    # Ask for the website directory
    website_dir=$(get_input "Enter the directory where you want to clone the website repository:" "$HOME/admin")

    # Clone the website repository
    clone_repository "https://github.com/hainam-tom/admin.git" "$website_dir"

    # Navigate to the cloned website directory and install dependencies
    cd "$website_dir" || { show_message "Failed to navigate to the website directory."; exit 1; }
    show_message "Installing website dependencies..."
    npm install

    # Ask for ports to run the servers
    api_port=$(get_input "Enter the port for the API server (default: 3000):" "3000")
    web_port=$(get_input "Enter the port for the web server (default: 8080):" "8080")

    # Start servers
    start_servers

    # Verify installations and show installed versions
    installed_versions=$(cat <<EOF
Installed Versions:
Homebrew version: $(brew --version | head -n 1)
Node.js version: $(node --version)
Git version: $(git --version)
json-server version: $(json-server --version)
http-server version: $(http-server --version)
EOF
    )
    show_message "$installed_versions"

    # Completion message
    show_message "Installation complete! Both the web server and API server are up and running."

    # Cleanup on exit
    trap cleanup EXIT
} || {
    show_message "An error occurred during the installation. Please check the terminal for details."
}

exit 0
