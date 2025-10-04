# AI Form Generator

A full-stack web application that allows authenticated users to generate, refine, and manage forms through natural language using OpenRouter's free AI model.

## Features

- **User Authentication**: Email/password-based registration and login via Supabase Auth
- **Natural Language Form Generation**: Describe forms in plain English and let AI generate them
- **Form Refinement**: Iteratively improve forms with natural language instructions
- **Response Collection**: Public forms collect responses that owners can view and analyze
- **Form History**: Track all versions and changes to your forms
- **Export Data**: Download responses as CSV files
- **Real-time Analytics**: View completion rates and response statistics

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Supabase client for authentication
- @rjsf/core for dynamic form rendering
- React Hot Toast for notifications

### Backend
- Node.js with Express.js
- Prisma ORM with PostgreSQL (Supabase)
- OpenRouter API for AI form generation
- Supabase for authentication and database

## Project Structure

```
Form-2/
├── frontend/          # React-Vite frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── lib/          # API client and utilities
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main app component
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js/Express backend API
│   ├── lib/          # Database and API clients
│   ├── middleware/   # Express middleware
│   ├── routes/       # API route handlers
│   ├── prisma/       # Database schema
│   ├── package.json
│   └── server.js     # Main server file
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Form-2
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Backend (`.env`):
   ```
   PORT=4000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   DATABASE_URL=your_database_url
   DIRECT_URL=your_direct_database_url
   ```

   Frontend (`.env`):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:4000
   ```

5. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## Usage

### Creating Forms

1. **Sign up/Login** to your account
2. **Navigate to "Create Form"** from the dashboard
3. **Describe your form** in natural language (e.g., "Create a registration form with name, email, college, and t-shirt size")
4. **Review and refine** the generated form if needed
5. **Share the form** using the public link to collect responses

### Refining Forms

1. **Open any form** from your dashboard
2. **Click "Edit"** to enter edit mode
3. **Describe changes** in natural language (e.g., "Add a phone number field")
4. **Apply changes** and see the updated form

### Managing Responses

1. **View responses** by clicking "Responses" on any form
2. **Export data** as CSV for analysis
3. **View analytics** including completion rates and field statistics

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/verify` - Verify authentication token

### Forms
- `GET /api/forms` - Get all user's forms
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms/generate` - Generate new form from prompt
- `PUT /api/forms/:id/refine` - Refine existing form
- `PUT /api/forms/:id/title` - Update form title
- `DELETE /api/forms/:id` - Delete form

### Responses
- `POST /api/responses/:formId` - Submit form response (public)
- `GET /api/responses/:formId` - Get form responses (authenticated)
- `GET /api/responses/:formId/stats` - Get response statistics

## Database Schema

### Forms Table
- `id` (UUID) - Primary key
- `owner_id` (UUID) - References auth.users
- `title` (Text) - Form title
- `schema` (JSONB) - Form schema and UI configuration
- `version` (Integer) - Current version number
- `created_at` (Timestamp) - Creation date

### Form Versions Table
- `id` (UUID) - Primary key
- `form_id` (UUID) - References forms table
- `schema` (JSONB) - Version-specific schema
- `change_prompt` (Text) - User instruction for this version
- `created_at` (Timestamp) - Version creation date

### Responses Table
- `id` (UUID) - Primary key
- `form_id` (UUID) - References forms table
- `data` (JSONB) - Response data
- `created_at` (Timestamp) - Submission date

## Deployment

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with Node.js buildpack

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

### Database
- Supabase handles the PostgreSQL database
- Run `npx prisma db push` to sync schema changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

Built with ❤️ using React, Node.js, Supabase, and OpenRouter AI


