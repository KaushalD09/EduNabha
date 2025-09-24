# Simple HTTP Server using PowerShell
# This script creates a basic HTTP server to serve the EduNabha application

$port = 8080
$url = "http://localhost:$port/"
$folderPath = $PSScriptRoot

# Create a listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "EduNabha server started at $url"
Write-Host "Press Ctrl+C to stop the server"

# Open the URL in the default browser
Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Get the requested file path
        $requestedFile = $request.Url.LocalPath.TrimStart('/')
        
        # Default to index.html if root is requested
        if ($requestedFile -eq '') {
            $requestedFile = 'index.html'
        }
        
        $filePath = Join-Path $folderPath $requestedFile
        
        # Check if the file exists
        if (Test-Path $filePath -PathType Leaf) {
            # Get the file content
            $content = [System.IO.File]::ReadAllBytes($filePath)
            
            # Set content type based on file extension
            $extension = [System.IO.Path]::GetExtension($filePath)
            switch ($extension) {
                '.html' { $contentType = 'text/html' }
                '.css'  { $contentType = 'text/css' }
                '.js'   { $contentType = 'application/javascript' }
                '.json' { $contentType = 'application/json' }
                '.svg'  { $contentType = 'image/svg+xml' }
                default { $contentType = 'application/octet-stream' }
            }
            
            # Set response headers
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            
            # Write the content to the response
            $output = $response.OutputStream
            $output.Write($content, 0, $content.Length)
            $output.Close()
        }
        else {
            # File not found
            $response.StatusCode = 404
            $response.Close()
        }
        
        # Log the request
        Write-Host "$($request.HttpMethod) $($request.Url.LocalPath) - $($response.StatusCode)"
    }
}
finally {
    # Stop the listener when done
    $listener.Stop()
    Write-Host "Server stopped"
}