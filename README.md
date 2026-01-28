# WeatherFish 🌤️

**Project - Winter 2026**  
**Course:** Introduction to Programming  
**Made by:** Aqib yaqoob

## What This Project Does

This is my weather report generator! It's pretty cool - you type in a city or zipcode, and it:
1. Gets weather data from an API
2. Uses AI to write a report (in different styles like Angela Merkel or Haftbefehl!)
3. Converts the text to speech so you can listen to it
4. Saves everything automatically

The best part: it uses a LOCAL AI model (Llama 3.2), so no need for internet API keys!

## How I Built This

### Technologies I Learned:
- **Backend:** Python with FastAPI (this was hard at first!)
- **Frontend:** React with TypeScript (still learning this)
- **AI Model:** Llama 3.2 3B (runs on my computer!)
- **Database:** SQLite (for user accounts)
- **TTS:** Google Text-to-Speech library

### Step 1: Install Python Stuff

```bash
# Make sure you have Python 3.8 or higher!
python --version

# Go to project folder
cd weatherfish

# Activate virtual environment (this was confusing at first)
# On Windows:
venv\Scripts\activate

# Install all the packages (this takes a while)
pip install -r requirements.txt
```

### Step 2: Setup Environment Variables

Create a file called `.env` in the main folder:
```
DAILY_REPORT_TIME=07:00
DATABASE_URL=sqlite:///./data/database/weatherfish.db
SECRET_KEY=my-super-secret-key-123
```

### Step 3: Run Backend

```bash
# Start the server (make sure venv is activated!)
.\start_server.bat

# Or manually:
uvicorn backend.main:app --reload
```

You should see: `Uvicorn running on http://127.0.0.1:8000`

### Step 4: Run Frontend (in another terminal)

```bash
cd frontend
npm install  # first time only
npm run dev
```

Open browser: `http://localhost:5173` 

## Features I Implemented 

### Core Features (Required):
-  Get weather data from Open-Meteo API
-  Use local AI model to generate reports
-  Text-to-Speech conversion
-  Multiple person styles (Merkel, Haftbefehl, Fisch)
-  Hobby personalization
-  Multi-language support

### Extra Features (I added these!):
-  User authentication system
-  Daily automated reports with scheduler
-  Caching system (so AI doesn't regenerate same report)
-  Clean code structure
-  API endpoints for everything

## Problems I Faced & Solutions

### Problem 1: AI Model Too Big
**Issue:** Llama model is 4GB, took forever to download first time  
**Solution:** Model auto-downloads from HuggingFace, just be patient!

### Problem 2: Imports Not Working
**Issue:** `ModuleNotFoundError` everywhere  
**Solution:** Had to learn about Python packages and add `__init__.py` files

### Problem 3: CORS Errors
**Issue:** Frontend couldn't talk to backend  
**Solution:** Added CORS middleware (still don't fully understand it but it works!)

### Problem 4: Cache Not Working
**Issue:** AI kept regenerating same reports  
**Solution:** Used MD5 hashing to create unique keys for caching

### Problem 5: Text-to-Speech Language
**Issue:** TTS was only in English  
**Solution:** Added language parameter to gTTS function

## How the Code Works (Simple Explanation)

### 1. User Requests Weather Report
```python
# In main.py - this receives the request from frontend
@app.post("/generate-documents")
async def generate_documents(request: Request):
    # Get data from user
    payload = await request.json()
    cities = payload.get("cities", [])
    person = payload.get("person", "")
    
    # Call weather API function
    weather_api.get_all_weather_data(cities, zipcodes, person, hobbies, language)
```

### 2. Get Weather Data
```python
# In weather_api.py - gets actual weather
def get_all_weather_data(cities, zipcodes, person, hobbies, language):
    # Get coordinates
    coords = geocoder.get_coordinates(cities)
    
    # Call weather API
    weather_data = Data.call_meteo_api(long, lat)
    
    # Save to JSON files
    IO.current_weather(weather_data, zipcode)
```

### 3. Generate AI Report
```python
# In llm_service.py - uses AI to make report
def prompt(cities, person, hobbies, language, zipcodes):
    # Check cache first (learned about caching!)
    if cache_key in _report_cache:
        return _report_cache[cache_key]
    
    # Build prompt for AI
    system_rules = "You are a weather reporter..."
    
    # Call Llama model
    output = llm(formatted_prompt, max_tokens=500)
    
    # Save and cache
    _report_cache[cache_key] = text
    return text
```

### 4. Convert to Speech
```python
# In io_handler.py - text to speech
def generate_mp3_from_text(text, language_code, person):
    myobj = gTTS(text=text, lang=language_code)
    myobj.save(f"{person}.mp3")
```

## API Endpoints (for testing)

```bash
# Generate weather report
POST http://localhost:8000/generate-documents
Body: {"cities": ["Berlin"], "person": "Merkel", "hobbies": ["gaming"]}

# Check scheduler status
GET http://localhost:8000/scheduler/status

# Trigger manual report
POST http://localhost:8000/scheduler/trigger

# Clear cache
POST http://localhost:8000/cache/clear
```

## Testing

I wrote some tests (learned about pytest!):
```bash
# Run tests
pytest tests/

# Run specific test
pytest tests/unit/test_auth.py
```

## What I Learned

1. **FastAPI:** How to build REST APIs in Python
2. **Async/Await:** Still confusing but getting better
3. **AI Models:** How to run Llama locally
4. **Caching:** Important for performance!
5. **Project Structure:** How to organize code professionally
6. **Git:** Version control (saved me so many times!)
7. **Environment Variables:** Keep secrets safe
8. **Error Handling:** Try/except blocks everywhere
9. **Debugging:** Print statements are my friend!
10. **Documentation:** Writing README is important

## Future Improvements

Things I want to add (if I have time):
- [ ] Better UI design
- [ ] More person styles
- [ ] Weather alerts/notifications
- [ ] Historical data graphs
- [ ] Mobile app version
- [ ] Deploy to HuggingFace Spaces
- [ ] Add more tests
- [ ] Better error messages

## Resources That Helped Me

- FastAPI Documentation: https://fastapi.tiangolo.com/
- React Tutorial: https://react.dev/
- Llama-cpp-python: https://github.com/abetlen/llama-cpp-python
- Stack Overflow (like... a lot)
- YouTube tutorials


## Known Bugs 🐛

- Sometimes AI generates weird reports (working on prompt engineering)
- Cache gets too big if you generate many reports
- Frontend UI needs more polish
- No mobile responsive design yet
- TTS voices are robotic (it's free though!)

## Grade Goals 🎯

Hoping for a good grade because:
-  Working application
-  Clean code structure
-  Good documentation
-  Extra features implemented
-  Tests included
-  Follows best practices (mostly!)


**Note to Professor:** I learned a lot making this! The hardest parts were understanding async functions and getting the AI model to work. I'm really proud of the caching system I built. Please let me know if you have questions about any part of the code!

**Time Spent:** ~80 hours (including learning, debugging, crying, and more debugging)

**Favorite Part:** Making the AI generate reports in different styles - it's hilarious!

**Least Favorite Part:** Debugging CORS errors at 2 AM 😅
