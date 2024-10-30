#!/bin/bash

# Define configuration file
CONFIG_FILE="$HOME/api_setup.conf"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$HOME/api_setup.log"
}

# Function to install Homebrew if not installed
install_homebrew() {
    log_message "Installing Homebrew..."
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [[ $(uname -m) == "arm64" ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    log_message "Homebrew installation complete!"
}

# Function to display a message using dialog
show_message() {
    dialog --title "Information" --msgbox "$1" 10 60
}

# Function to get user input using dialog
get_input() {
    dialog --inputbox "$1" 10 60 "$2" 3>&1 1>&2 2>&3
}

# Function to confirm user action
confirm_action() {
    dialog --title "Confirmation" --yesno "$1" 10 60
    return $?
}

# Function to install a package and handle errors
install_package() {
    local package_name="$1"
    local install_command="$2"
    
    if ! command -v "$package_name" &> /dev/null; then
        log_message "$package_name not found. Installing..."
        echo "Installing $package_name..."
        eval "$install_command"
        if [ $? -eq 0 ]; then
            log_message "$package_name installation complete!"
        else
            log_message "Failed to install $package_name."
            show_message "Failed to install $package_name. Please check the error messages."
            exit 1
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
        log_message "Cloning repository from $repo_url..."
        echo "Cloning repository from $repo_url..."
        git clone "$repo_url" "$target_dir"
        if [ $? -eq 0 ]; then
            log_message "Repository cloned successfully."
        else
            log_message "Failed to clone the repository."
            show_message "Failed to clone the repository. Please check the error messages."
            exit 1
        fi
    else
        show_message "Directory $target_dir already exists. Skipping cloning."
    fi
}

# Function to start servers with optional background running
start_servers() {
    log_message "Starting the API server using hainam.json..."
    echo "Starting the API server using hainam.json on port $api_port..."

    # Start the API server using hainam.json
    (cd "$api_dir/api_jsa37" && json-server --watch hainam.json --port "$api_port" > "$api_dir/api_server.log" 2>&1) &

    # Start the web server
    if [ -d "$website_dir" ]; then
        log_message "Starting the web server (http-server)..."
        echo "Starting the web server (http-server) on port $web_port..."
        (cd "$website_dir" && http-server -p "$web_port" > "$website_dir/web_server.log" 2>&1) &
    else
        log_message "Website directory does not exist."
        show_message "Website directory does not exist. Please provide a valid path."
        exit 1
    fi

    if [[ "$background_running" == "true" ]]; then
        show_message "Both servers are running in the background. You can close this terminal."
    else
        show_message "Both servers are running in the foreground. You can stop them using Ctrl+C."
    fi
}

# Cleanup function to kill background processes
cleanup() {
    if confirm_action "Are you sure you want to stop all running servers?"; then
        pkill -f json-server
        pkill -f http-server
        show_message "Cleanup completed. All servers have been stopped."
        log_message "Cleanup completed. All servers have been stopped."
    else
        show_message "Cleanup canceled. Servers will continue running."
    fi
}

# Uninstall function to remove installed packages and directories
uninstall() {
    if confirm_action "Are you sure you want to uninstall everything? This will remove all installed packages and cloned repositories."; then
        rm -rf "$api_dir/api_jsa37"
        rm -rf "$website_dir"
        pkill -f json-server
        pkill -f http-server
        show_message "Uninstallation complete."
        log_message "Uninstallation complete."
    else
        show_message "Uninstallation canceled."
    fi
}

# Repair function to reinstall missing packages
repair() {
    log_message "Checking for missing packages..."
    show_message "Checking for missing packages..."
    install_package "git" "brew install git"
    install_package "node" "brew install node"
    install_package "json-server" "npm install -g json-server"
    install_package "http-server" "npm install -g http-server"
}

# Save configuration settings to a file
save_config() {
    echo "api_dir=$api_dir" > "$CONFIG_FILE"
    echo "website_dir=$website_dir" >> "$CONFIG_FILE"
    echo "api_port=$api_port" >> "$CONFIG_FILE"
    echo "web_port=$web_port" >> "$CONFIG_FILE"
}

# Load configuration settings from a file
load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        source "$CONFIG_FILE"
    fi
}

# Main script execution
{
    load_config  # Load previous configurations if available

    # Welcome message
    dialog --title "Setup Script" --msgbox "Welcome to the automatic setup script! This will install Git, Node.js, json-server, and http-server, and run both a web server and an API server." 10 60

    # Prompt for action
    if confirm_action "Do you want to (1) Install, (2) Uninstall, or (3) Repair?"; then
        action=$(dialog --title "Choose Action" --menu "Select an action:" 15 50 3 \
            1 "Install" \
            2 "Uninstall" \
            3 "Repair" \
            3>&1 1>&2 2>&3)
    fi

    case $action in
        1)  # Install
            # Check for Homebrew and install if not found
            if ! command -v brew &> /dev/null; then
                install_homebrew
            else
                log_message "Homebrew is already installed."
                show_message "Homebrew is already installed."
            fi

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
                log_message "Created directory: $api_dir"
            fi

            # Clone the API repository
            clone_repository "https://github.com/BuiThang652/api_jsa37.git" "$api_dir/api_jsa37"

            # Navigate to the cloned API directory and install dependencies
            cd "$api_dir/api_jsa37" || { log_message "Failed to navigate to the API directory."; exit 1; }
            echo "Installing API dependencies..."
            npm install --silent
            log_message "API dependencies installed."

            # Ask for the website directory
            website_dir=$(get_input "Enter the directory where you want to clone the website repository:" "$HOME/admin")

            # Clone the website repository
            clone_repository "https://github.com/hainam-tom/admin.git" "$website_dir"

            # Navigate to the cloned website directory and install dependencies
            cd "$website_dir" || { log_message "Failed to navigate to the website directory."; exit 1; }
            echo "Installing website dependencies..."
            npm install --silent
            log_message "Website dependencies installed."

            # Ask for ports to run the servers
            api_port=$(get_input "Enter the port for the API server (default: 3000):" "3000")
            web_port=$(get_input "Enter the port for the web server (default: 8080):" "8080")

            # Ask if the user wants to run servers in the background
            if confirm_action "Do you want to run both servers in the background?"; then
                background_running="true"
            else
                background_running="false"
            fi

            # Save configuration settings
            save_config

            # Check for any running processes and offer to terminate them
            if pgrep -f json-server || pgrep -f http-server; then
                if confirm_action "Previous server instances are running. Would you like to terminate them before starting new ones?"; then
                    pkill -f json-server
                    pkill -f http-server
                fi
            fi

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
            log_message "Installation complete! Both the web server and API server are running."
            show_message "Installation complete! Both the web server and API server are running."
            ;;
        
        2)  # Uninstall
            uninstall
            ;;
        
        3)  # Repair
            repair
            ;;
        
        *) 
            show_message "No valid action selected."
            ;;
    esac

    # Cleanup on exit
    trap cleanup EXIT
} || {
    log_message "An error occurred during the installation."
    show_message "An error occurred during the installation. Please check the terminal for details."
}

exit 0
