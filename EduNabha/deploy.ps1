# EduNabha Deployment Script
# This script prepares and deploys the EduNabha application to a web server

Write-Host "Starting EduNabha deployment process..." -ForegroundColor Green

# Create deployment directory
$deploymentDir = ".\deployment"
if (Test-Path $deploymentDir) {
    Remove-Item -Path $deploymentDir -Recurse -Force
}
New-Item -Path $deploymentDir -ItemType Directory | Out-Null

# Copy frontend files
Write-Host "Copying frontend files..." -ForegroundColor Cyan
$frontendFiles = @(
    ".\index.html",
    ".\manifest.json",
    ".\service-worker.js"
)
foreach ($file in $frontendFiles) {
    Copy-Item -Path $file -Destination $deploymentDir
}

# Copy directories
$directories = @(
    ".\css",
    ".\js",
    ".\images",
    ".\data"
)
foreach ($dir in $directories) {
    Copy-Item -Path $dir -Destination $deploymentDir -Recurse
}

# Prepare backend
Write-Host "Preparing backend..." -ForegroundColor Cyan
$backendDeployDir = "$deploymentDir\backend"
New-Item -Path $backendDeployDir -ItemType Directory | Out-Null

# Copy backend files
Copy-Item -Path ".\backend\server.js" -Destination $backendDeployDir
Copy-Item -Path ".\backend\package.json" -Destination $backendDeployDir
Copy-Item -Path ".\backend\routes" -Destination $backendDeployDir -Recurse
Copy-Item -Path ".\backend\models" -Destination $backendDeployDir -Recurse
Copy-Item -Path ".\backend\middleware" -Destination $backendDeployDir -Recurse

# Create production .env file
$envContent = @"
PORT=3000
MONGODB_URI=mongodb://localhost:27017/edunabha
JWT_SECRET=your-production-secret-key
NODE_ENV=production
"@
Set-Content -Path "$backendDeployDir\.env" -Value $envContent

# Create deployment README
$readmeContent = @"
# EduNabha Deployment

This directory contains the production-ready version of EduNabha.

## Frontend Deployment
1. Upload all files except the 'backend' folder to your web hosting service
2. Configure your web server to serve the application

## Backend Deployment
1. Navigate to the 'backend' directory
2. Run 'npm install' to install dependencies
3. Update the .env file with your production database credentials
4. Start the server with 'node server.js' or use a process manager like PM2

## Configuration
- Update the API endpoints in js/app.js to point to your production backend URL
"@
Set-Content -Path "$deploymentDir\DEPLOYMENT.md" -Value $readmeContent

# Create a simple deployment configuration file
$configContent = @"
{
  "name": "EduNabha",
  "version": "1.0.0",
  "apiEndpoint": "https://your-production-api.com/api",
  "deploymentDate": "$(Get-Date -Format "yyyy-MM-dd")"
}
"@
Set-Content -Path "$deploymentDir\deployment-config.json" -Value $configContent

Write-Host "Deployment package created successfully at $deploymentDir" -ForegroundColor Green
Write-Host "To publish your application:" -ForegroundColor Yellow
Write-Host "1. Upload the frontend files to your web hosting service" -ForegroundColor Yellow
Write-Host "2. Deploy the backend to your server and configure as needed" -ForegroundColor Yellow
Write-Host "3. Update the API endpoints in the frontend code to point to your backend" -ForegroundColor Yellow
Write-Host "See DEPLOYMENT.md for detailed instructions" -ForegroundColor Yellow