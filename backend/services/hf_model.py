from transformers import pipeline
from . import IO
import threading

_lock = threading.Lock()
_generator = None
MAX_INPUT_LENGTH = 450  # conservative token limit to avoid exceeding model context


def get_generator():
    global _generator
    if _generator is None:
        with _lock:
            if _generator is None:
                _generator = pipeline(
                    task="text2text-generation",
                    model="google/flan-t5-large",
                    max_length=300
                )
    return _generator


def compact_weather_summary(data: dict) -> str:
    """
    Reduce structured weather JSON to a compact textual summary
    that fits into the model context window.
    """
    summaries = []

    for location, weather in data.items():
        current = weather.get("current", {})
        daily = weather.get("daily_weekone", {})
        today = next(iter(daily.values()), {}) if daily else {}

        summary = (
            f"{location}: "
            f"temp {current.get('temperature', 'N/A')}°C, "
            f"feels like {current.get('feels like', 'N/A')}°C, "
            f"sky {current.get('overcast', 'unknown')}, "
            f"min {today.get('mintemp', 'N/A')}°C, "
            f"max {today.get('maxtemp', 'N/A')}°C, "
            f"precipitation {today.get('precipitation', 'none')}."
        )
        summaries.append(summary)

        # Stop adding more if the summary gets too long
        if len(" ".join(summaries)) > MAX_INPUT_LENGTH:
            break

    return " ".join(summaries)


def prompt(cities: list, person: str, hobbies: list, language: str, zipcodes: list):
    raw_data = IO.get_dict_from_json(zipcodes, cities)
    summary = compact_weather_summary(raw_data)

    # Map ISO code to full language name
    lang_map = {"de": "German", "en": "English", "fr": "French"}
    language_name = lang_map.get(language, "English")

    # Construct the prompt with explicit instructions
    prompt_str = (
        f"Weather summary: {summary}\n"
        f"Write the weather report in {language_name}.\n"
        f"Integrate the following hobbies into the report, one per city if possible: {', '.join(hobbies)}.\n"
    )

    if person:
        prompt_str += f"Write the report in the style of {person}.\n"

    prompt_str += (
        "Write exactly five sentences. "
        "The first sentence is a general introduction. "
        "Each following sentence describes the weather for one city and if possible mentions a hobby. "
        "Do not use bullet points. "
        "Start immediately with the report.\n"
    )

    generator = get_generator()
    result = generator(prompt_str)

    text = result[0]["generated_text"]
    IO.write_prompt_to_txt(text, person)
    return text
