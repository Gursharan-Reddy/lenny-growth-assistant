# The Lenny Growth Assistant

An enterprise product and growth intelligence platform grounded in insights from Lenny's Podcast. The assistant leverages FastAPI, PostgreSQL, SQLAlchemy, and Google Gemini to provide deep growth, retention, and product-led growth (PLG) advice.

---

## Architecture & Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy (Async), Pydantic, Uvicorn
- **AI Provider**: Google Gemini SDK (`gemini-3.6-flash`)
- **Database**: PostgreSQL (Hosted/Neon/Render persistent storage)
- **Frontend**: Next.js 14, Tailwind CSS, Vercel deployment

---

## Project Structure

```text
lenny-growth-assistant/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers (chat, health, sessions)
│   │   ├── models/       # SQLAlchemy database models
│   │   ├── providers/    # LLM abstraction layer (Gemini, Ollama)
│   │   ├── database.py   # Async session configuration
│   │   ├── main.py       # FastAPI application entrypoint
│   │   └── config.py     # Environment configurations
│   ├── Dockerfile        # Container build definition
│   ├── build.sh          # Render deployment build script
│   └── requirements.txt  # Python dependency manifest
└── README.md
```

---

## Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Gursharan-Reddy/lenny-growth-assistant.git
cd lenny-growth-assistant
```

### 2. Set Up the Backend Environment

Navigate to the backend directory and configure your local environment variables:

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/lenny_growth_db
```

### 3. Run the Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`, with interactive docs available at `http://localhost:8000/docs`.

---

## API Endpoints

| Endpoint      | Description |
|---------------|-------------|
| `POST /chat`  | Accepts session tracking, chat message content, and provider parameters. Saves message history and returns assistant responses, grounded podcast sources, and markdown artifacts. |
| `GET /health` | Performs live database connectivity and service health checks. |
| `GET /sessions` | Retrieves and organizes active growth session histories. |