# AI Farm Tool

## Overview

This is a full-stack agricultural assistant application built with React, Express, and TypeScript. The application provides farmers and gardeners with AI-powered tools for plant care guidance, disease detection, and multilingual chat assistance. It uses OpenAI's GPT-4o model for intelligent responses and features a modern, responsive UI built with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight routing library)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured error handling
- **File Uploads**: Multer middleware for image processing
- **Development**: Custom Vite integration for hot module replacement

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Type-safe database schemas with Zod validation
- **Storage Abstraction**: Interface-based storage layer with in-memory fallback

## Key Components

### Core Features
1. **AI Chat Assistant**: Multilingual agricultural guidance using OpenAI GPT-4o
2. **Disease Detection**: Image-based plant disease analysis with treatment recommendations
3. **Plant Care Guide**: Search-based plant information and care instructions
4. **Activity Tracking**: User activity logging across all features

### Database Schema
- **Users**: Basic user management system
- **Chat Messages**: Conversation history with language support
- **Disease Detections**: Image analysis results with confidence scores
- **Plant Care Records**: Plant information and care instructions (JSON format)
- **Activities**: User activity logging for all interactions

### UI Components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Component Library**: Comprehensive UI components based on Radix UI
- **Theme System**: CSS variables for consistent theming
- **File Upload**: Drag-and-drop image upload with validation

## Data Flow

### Request Flow
1. Client sends requests through TanStack Query
2. Express middleware handles logging and error processing
3. Route handlers process business logic
4. Storage layer abstracts data persistence
5. OpenAI service integration for AI features

### State Management
- **Server State**: TanStack Query for API data caching and synchronization
- **Local State**: React hooks for component-specific state
- **Language Context**: React Context for multilingual support

### File Handling
- **Upload Process**: Multer processes image uploads to local storage
- **Validation**: File type and size validation on server
- **Analysis**: Images sent to OpenAI for disease detection

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for chat, disease analysis, and plant care
- **Image Analysis**: Vision capabilities for plant disease detection

### Database Services
- **Neon Database**: PostgreSQL serverless database hosting
- **Connection**: Drizzle ORM with connection pooling

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Production bundling for backend

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Environment Configuration
- **Development**: Vite dev server with HMR and backend proxy
- **Production**: Express serves static files and API routes
- **Database**: Environment-based connection strings

### Scalability Considerations
- **Storage Interface**: Abstracted for easy migration to database storage
- **Session Management**: Configured for PostgreSQL session store
- **Caching**: TanStack Query provides client-side caching
- **Error Handling**: Comprehensive error boundaries and logging

### Security Features
- **File Upload Validation**: Type and size restrictions
- **API Rate Limiting**: Built-in request logging
- **Environment Variables**: Secure configuration management
- **CORS**: Configured for cross-origin requests