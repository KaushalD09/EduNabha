# PowerShell script to start the EduNabha backend server
Write-Host "Starting EduNabha Backend Server..."
Write-Host "Press Ctrl+C to stop the server"

# Navigate to the backend directory
Set-Location $PSScriptRoot

# Start the Node.js server
node server.js