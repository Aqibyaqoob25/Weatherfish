# My Weather App - Main File
# This is where everything starts!
# Made by: Student Name
# Date: January 2026

# importing stuff I need
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.services import weather_api
from backend.routes import auth
from backend.services import scheduler_service as scheduler
import uvicorn
import os

# create the app - this is the main thing
app = FastAPI()

# add the auth router (learned this from tutorial)
app.include_router(auth.router)

# CORS stuff - needed so frontend can talk to backend
# without this nothing works lol
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (not sure if this is safe but it works)
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods
    allow_headers=["*"],  # allow all headers
)

# this runs when the app starts
@app.on_event("startup")
async def startup_event():
    # try to start the scheduler for daily reports
    print("Starting up the app...")  # debug print
    
    # get the time from environment or use 7am
    daily_time = os.getenv("DAILY_REPORT_TIME", "07:00")
    print(f"Daily report time set to: {daily_time}")  # debug
    
    try:
        scheduler.start_scheduler(daily_time=daily_time)
        print("Scheduler started successfully!")  # yay it works!
    except Exception as e:
        print(f"Oops! Scheduler didn't start: {e}")  # if it breaks
        print("But the app will still work without scheduler")

# this runs when we close the app
@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")  # debug
    scheduler.stop_scheduler()
    print("Scheduler stopped!")

# Main endpoint - this is where the magic happens!
# when frontend sends data, this function receives it
@app.post("/generate-documents")
async def generate_documents(request: Request):
    print("\n=== NEW REQUEST RECEIVED ===")  # always good to see whats happening
    
    try:
        # get the data from frontend
        payload = await request.json()
        print(f"Got payload: {payload}")  # debug - see what we got

        # extract all the stuff we need from the request
        cities = payload.get("cities", [])  # list of cities
        zipcodes = payload.get("zipcodes", [])  # list of zipcodes
        person = payload.get("person", "")  # like "Merkel" or "Haftbefehl"
        hobbies = payload.get("hobbies", [])  # user hobbies
        language = payload.get("language", "de")  # default german
        
        # print everything to see if it works
        print(f"Cities: {cities}")
        print(f"Zipcodes: {zipcodes}")
        print(f"Person style: {person}")
        print(f"Hobbies: {hobbies}")
        print(f"Language: {language}")

        print("Starting to generate weather data...")  # let me know its working
        # call the function that does all the work
        weather_api.get_all_weather_data(cities, zipcodes, person, hobbies, language)
        print("Done! Weather data generated successfully!")  # success!

        # send success response back to frontend
        return {"status": "success", "message": "Weather data created!"}

    except Exception as e:
        # if something breaks, show me what happened
        import traceback
        print("ERROR! Something went wrong:")
        print(f"Error message: {e}")
        traceback.print_exc()  # show full error
        
        # send error back to frontend
        return {"status": "error", "message": str(e)}

# endpoint to check if scheduler is running
@app.get("/scheduler/status")
async def get_scheduler_status():
    print("Checking scheduler status...")  # debug
    try:
        status = scheduler.get_scheduler_status()
        print(f"Scheduler status: {status}")  # see what it says
        return {"status": "success", "data": status}
    except Exception as e:
        print(f"Error getting status: {e}")
        return {"status": "error", "message": str(e)}

# endpoint to manually trigger report (for testing)
@app.post("/scheduler/trigger")
async def trigger_manual_report():
    print("Manual report trigger requested!")  # debug
    try:
        scheduler.trigger_manual_report()
        print("Report triggered successfully!")  # it works!
        return {"status": "success", "message": "Report generation started!"}
    except Exception as e:
        print(f"Error triggering report: {e}")  # show error
        import traceback
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

# endpoint to clear cache (if reports get stuck)
@app.post("/cache/clear")
async def clear_report_cache():
    print("Clearing cache...")  # debug
    try:
        # import the cache from the API file
        from backend.services import llm_service
        cache_size = len(llm_service._report_cache)
        llm_service._report_cache.clear()  # clear it!
        print(f"Cleared {cache_size} cached reports")  # let me know
        return {"status": "success", "message": f"Cleared {cache_size} cached reports"}
    except Exception as e:
        print(f"Error clearing cache: {e}")
        return {"status": "error", "message": str(e)}

# this runs the server (when we run python main.py)
if __name__ == "__main__":
    print("Starting the server...")
    print("Go to http://127.0.0.1:8000 to see it!")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
