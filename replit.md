# Overview

AlgoQuest is a comprehensive coding platform built for algorithm practice and competitive programming. The application features a problem-solving environment with interactive code editor, algorithm visualization capabilities, and competitive elements like contests and leaderboards. It combines modern web technologies to create an engaging learning experience for developers looking to improve their algorithmic skills.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side application is built with **React** and **TypeScript**, utilizing a component-based architecture. The UI leverages **shadcn/ui** components built on top of **Radix UI** primitives for accessibility and customization. **Tailwind CSS** provides utility-first styling with a comprehensive design system including dark mode support and CSS variables for theming.

**State Management**: Uses **TanStack Query** (React Query) for server state management, providing caching, synchronization, and optimistic updates. Local state is managed through React hooks and context providers.

**Routing**: Implements client-side routing with **Wouter**, a lightweight alternative to React Router, handling navigation between home, individual problem pages, and error states.

**Code Editor Integration**: Features **Monaco Editor** (VS Code's editor) loaded dynamically for syntax highlighting and code editing across multiple programming languages (JavaScript, Python, Java).

**Visualization System**: Custom canvas-based algorithm visualization system for educational purposes, supporting array traversal, sorting algorithms, and other data structure operations.

## Backend Architecture

The server is built with **Express.js** and **TypeScript**, following a RESTful API design pattern. The application uses a modular architecture separating routes, storage layers, and utility functions.

**API Design**: RESTful endpoints for problems, submissions, contests, users, and activities. Includes filtering capabilities for problems and comprehensive CRUD operations.

**Storage Abstraction**: Implements an interface-based storage system (`IStorage`) with initial in-memory implementation (`MemStorage`), designed for easy migration to persistent databases. The storage layer handles users, problems, submissions, contests, and activity tracking.

**Code Execution**: Server-side code execution system supporting multiple programming languages with sandboxed execution and test case validation.

## Data Layer

**Database**: Configured for **PostgreSQL** using **Drizzle ORM** with **Neon Database** serverless driver. The schema supports comprehensive competitive programming features including user management, problem categorization, submission tracking, contest management, and activity feeds.

**Schema Design**: 
- Users with scoring and problem-solving statistics
- Problems with difficulty levels, categories, tags, test cases, and starter code templates
- Submissions with execution results and performance metrics
- Contests with participation tracking
- Activity feed for user engagement

**Connection Management**: Uses connection pooling with `@neondatabase/serverless` for efficient database connections in serverless environments.

## Development Tooling

**Build System**: **Vite** for fast development and optimized production builds with Hot Module Replacement (HMR) and TypeScript support.

**Development Environment**: Configured for **Replit** with specific plugins for error handling and development experience, including runtime error modals and cartographer integration.

**Type Safety**: Comprehensive TypeScript configuration with strict mode, path mapping for clean imports, and shared type definitions between client and server.

**Validation**: **Zod** schemas with **Drizzle-Zod** integration for runtime type validation and database schema consistency.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migrations and schema management

## UI and Styling
- **Radix UI**: Accessible, unstyled UI components
- **shadcn/ui**: Pre-built component library with design system
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Development and Runtime
- **Monaco Editor**: Code editor via CDN integration
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **date-fns**: Date manipulation utilities
- **Wouter**: Lightweight routing solution

## Build and Deployment
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundling for server-side code
- **TypeScript**: Type checking and compilation
- **PostCSS**: CSS processing with Autoprefixer

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development environment integration