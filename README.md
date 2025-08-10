# 🎬 Streaming Platform

A modern streaming platform built with React.js, Node.js, and Spring Boot, offering a complete movie and series browsing experience with user management and personalized features.

## 🚀 Features

### User Authentication & Management
- **User Registration & Login**: Secure user account creation and authentication system
- **Profile Management**: Edit user information including name, CPF, password, and email
- **User Dashboard**: Personalized user experience with custom preferences

### Content Discovery & Management
- **Home Page**: Browse trending movies and series with an intuitive interface
- **Favorites System**: Add movies and series to a personalized favorites list displayed at the top of the home page
- **Advanced Search**: Search bar for quick content discovery across the entire catalog
- **Content Details**: View comprehensive information including descriptions, ratings, and trailers
- **Dedicated Pages**: 
  - Movies-only filtering page
  - Series-only filtering page
  - Search results page

### Content Features
- **Movie & Series Catalog**: Extensive library of entertainment content
- **Trailers**: Watch trailers directly within the platform
- **Ratings**: Content classification and rating system
- **Responsive Design**: Optimized experience across all devices

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework for building interactive user interfaces
- **CSS3**: Custom styling with responsive design
- **JavaScript (ES6+)**: Modern JavaScript features and syntax

### Backend
- **Spring Boot**: Java-based backend framework for robust API development
- **Node.js**: JavaScript runtime for additional backend services
- **RESTful APIs**: Well-structured API endpoints for seamless frontend-backend communication

### Architecture
- **Full Stack Application**: Complete end-to-end solution
- **Component-Based Architecture**: Modular React components for maintainability
- **MVC Pattern**: Clean separation of concerns in the backend
- **Repository Pattern**: Data access layer abstraction

## 📁 Project Structure

```
streaming-platform/
├── backend/
│   ├── src/main/java/br/com/caio/platform/
│   │   ├── config/           # Configuration classes
│   │   ├── controllers/      # REST API controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entities/        # JPA entities
│   │   ├── exceptions/      # Custom exception handling
│   │   ├── repository/      # Data access layer
│   │   └── services/        # Business logic layer
│   └── PlatformApplication.java
└── frontend/
    ├── src/
    │   ├── components/      # Reusable React components
    │   ├── css/            # Stylesheet files
    │   └── pages/          # Page components
    ├── public/
    └── package.json
```

## 🎯 Key Components

### Backend Components
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic and data processing
- **Repositories**: Manage data persistence and retrieval
- **DTOs**: Ensure clean data transfer between layers
- **Entities**: Define data models and relationships

### Frontend Components
- **Pages**: Main application views (Home, Movies, Series, Profile)
- **Components**: Reusable UI elements (Header, Footer, Slide, Divider)
- **CSS Modules**: Modular styling for each component

## 🚦 Getting Started

### Prerequisites
- Java 11 or higher
- Node.js 14 or higher
- npm or yarn package manager
- Your preferred IDE (IntelliJ IDEA, VS Code, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/streaming-platform.git
   cd streaming-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)
*Main dashboard with featured content and favorites section*

### Movies Page
![Movies Page](screenshots/movies.png)
*Dedicated movies browsing with filtering options*

### Series Page
![Series Page](screenshots/series.png)
*Series catalog with detailed information*

### User Profile
![Edit Profile](screenshots/edit-profile.png)
*User information management interface*

### Search Results
![Search Page](screenshots/search.png)
*Advanced search functionality with real-time results*

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Content Management
- `GET /api/movies` - Fetch all movies
- `GET /api/series` - Fetch all series
- `GET /api/content/search` - Search content
- `GET /api/content/{id}` - Get content details

### User Favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/{id}` - Remove from favorites
- `GET /api/favorites/user/{userId}` - Get user favorites

## 🌟 Future Enhancements

- [ ] Video streaming functionality
- [ ] User reviews and comments system
- [ ] Content recommendation algorithm
- [ ] Multiple user profiles per account
- [ ] Download for offline viewing
- [ ] Social features and sharing
- [ ] Advanced filtering and sorting options

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

⭐ **Star this repository if you found it helpful!**
