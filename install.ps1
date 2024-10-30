# Define configuration file and log file
$configFile = "$HOME\api_setup.conf"
$logFile = "$HOME\api_setup.log"

# Function to log messages
function Log-Message {
    param($message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -Append -FilePath $logFile
}

# Function to install Winget if not installed
function Install-Winget {
    if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
        Log-Message "Winget is not installed. Installing Winget..."
        Invoke-WebRequest -Uri "https://aka.ms/getwinget" -OutFile "$env:TEMP\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.appxbundle"
        Add-AppxPackage "$env:TEMP\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.appxbundle"
        Log-Message "Winget installation complete."
    } else {
        Log-Message "Winget is already installed."
    }
}

# Function to install a package using Winget
function Install-Package {
    param($packageName, $installCommand)
    if (!(Get-Command $packageName -ErrorAction SilentlyContinue)) {
        Log-Message "$packageName not found. Installing..."
        Invoke-Expression $installCommand
        Log-Message "$packageName installation complete."
    } else {
        Log-Message "$packageName is already installed."
    }
}

# Function to clone a Git repository
function Clone-Repository {
    param($repoUrl, $targetDir)
    if (!(Test-Path -Path $targetDir)) {
        Log-Message "Cloning repository from $repoUrl to $targetDir..."
        git clone $repoUrl $targetDir
        Log-Message "Repository cloned successfully."
    } else {
        Log-Message "Directory $targetDir already exists. Skipping cloning."
    }
}

# Function to start the API and web servers
function Start-Servers {
    param($apiDir, $apiPort, $websiteDir, $webPort, $backgroundRunning)
    Log-Message "Starting the API server using hainam.json on port $apiPort..."
    Start-Process -FilePath "json-server" -ArgumentList "--watch $apiDir\hainam.json --port $apiPort" -NoNewWindow

    Log-Message "Starting the web server (http-server) on port $webPort..."
    Start-Process -FilePath "http-server" -ArgumentList "$websiteDir -p $webPort" -NoNewWindow

    if ($backgroundRunning) {
        Log-Message "Both servers are running in the background."
    } else {
        Log-Message "Both servers are running in the foreground."
    }
}

# Function to uninstall everything
function Uninstall-All {
    if ((Read-Host "Are you sure you want to uninstall everything? (Y/N)") -eq "Y") {
        Stop-Process -Name "json-server", "http-server" -Force
        Remove-Item -Recurse -Force -Path "$apiDir\api_jsa37", $websiteDir
        Log-Message "Uninstallation complete."
    } else {
        Log-Message "Uninstallation canceled."
    }
}

# Function to repair missing packages
function Repair {
    Log-Message "Repairing missing packages..."
    Install-Package "git" "winget install --id Git.Git -e --source winget"
    Install-Package "node" "winget install --id OpenJS.Nodejs.LTS -e --source winget"
    Install-Package "json-server" "npm install -g json-server"
    Install-Package "http-server" "npm install -g http-server"
}

# Function to load configuration
function Load-Config {
    if (Test-Path $configFile) {
        . $configFile
    }
}

# Main script
Load-Config
Install-Winget

$action = Read-Host "Choose action: 1) Install 2) Uninstall 3) Repair"

switch ($action) {
    "1" {
        Install-Package "git" "winget install --id Git.Git -e --source winget"
        Install-Package "node" "winget install --id OpenJS.Nodejs.LTS -e --source winget"
        Install-Package "json-server" "npm install -g json-server"
        Install-Package "http-server" "npm install -g http-server"
        
        $apiDir = Read-Host "Enter directory for API repo"
        Clone-Repository "https://github.com/BuiThang652/api_jsa37.git" "$apiDir\api_jsa37"
        $websiteDir = Read-Host "Enter directory for website repo"
        Clone-Repository "https://github.com/hainam-tom/admin.git" $websiteDir

        $apiPort = Read-Host "API server port (default 3000)"
        $webPort = Read-Host "Web server port (default 8080)"
        $backgroundRunning = Read-Host "Run servers in background? (Y/N)" -eq "Y"

        Start-Servers $apiDir $apiPort $websiteDir $webPort $backgroundRunning
    }
    "2" { Uninstall-All }
    "3" { Repair }
    default { Write-Host "Invalid action selected." }
}
