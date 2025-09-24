# EduNabha - Digital Learning for Rural Schools

EduNabha is a mobile and web-based digital learning application designed specifically for rural schools in Nabha and surrounding areas. The application addresses the challenges of limited computer infrastructure, unreliable internet connectivity, and access to quality digital educational resources.

## Key Features

- **Offline Functionality**: Access all educational content without internet connection
- **Local Language Support**: Content available in Punjabi, Hindi, and English
- **Interactive Lessons**: Engaging educational content tailored for rural students
- **Teacher Dashboard**: Track student progress and performance
- **Optimized for Low-End Devices**: Responsive design that works on older computers and mobile devices

## Project Structure

```
EduNabha/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Responsive CSS styles
├── js/
│   ├── app.js              # Core application functionality
│   └── offline.js          # Offline support with IndexedDB
├── images/                 # SVG icons and images
├── service-worker.js       # Service worker for offline caching
└── manifest.json           # PWA manifest file
```

## How to Use

1. Open the `index.html` file in a web browser
2. Navigate through the application using the top navigation menu
3. Browse available lessons and resources
4. Content is automatically cached for offline use
5. Teachers can access the dashboard to track student progress

## Deployment Instructions

To deploy this application in rural schools:

1. Copy the entire EduNabha folder to school computers
2. Create a desktop shortcut to the index.html file
3. For mobile deployment, host the files on a local server within the school
4. Students can access via browser and install as a PWA for offline use

## Development

This application is built using:
- HTML5, CSS3, and JavaScript
- Progressive Web App (PWA) technologies
- IndexedDB for offline data storage
- Service Workers for offline functionality

## Future Enhancements

- Add more interactive lessons and educational content
- Implement student accounts and progress tracking
- Develop more comprehensive teacher analytics
- Create a content management system for teachers to add custom lessons

## Contact

For more information about the EduNabha project, please contact the Punjab Education Department.