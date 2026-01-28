# Weather Report Generator using Local AI Model
# This file uses Llama model to generate weather reports
# Student project - learning to use AI models!

from backend.utils import io_handler as IO
from llama_cpp import Llama  # this is the library for running Llama models
import os
import hashlib  # for making unique keys
import json  # for working with JSON data

# Load the AI model - this takes a while first time!
# The model is downloaded from HuggingFace automatically
print("Loading AI model... (this might take a minute)")
llm = Llama.from_pretrained(
    repo_id="hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF",  # model name
    filename="llama-3.2-3b-instruct-q4_k_m.gguf",  # model file
    n_ctx=4096,  # context window size
    n_gpu_layers=32,  # use GPU if available
    n_threads=os.cpu_count(),  # use all CPU cores
    verbose=False  # dont show too much info
)
print("Model loaded successfully!")

# Cache to save reports - so we don't generate same thing twice!
# this is a dictionary that stores reports we already made
_report_cache = {}

def _generate_cache_key(cities: list, person: str, hobbies: list, language: str, zipcodes: list) -> str:
    # this function makes a unique key for each combination of inputs
    # so we can check if we already generated this report before
    
    cache_data = {
        "cities": sorted(cities),  # sort so order doesn't matter
        "zipcodes": sorted(zipcodes),
        "person": person,
        "hobbies": sorted(hobbies),
        "language": language
    }
    
    # convert to string and make a hash (unique ID)
    cache_string = json.dumps(cache_data, sort_keys=True)
    return hashlib.md5(cache_string.encode()).hexdigest()

def prompt(cities: list, person: str, hobbies: list, language: str, zipcodes: list):
    # Main function that generates weather reports
    # Takes in cities, person style, hobbies, language and zipcodes
    # Returns a text report
    
    print(f"\\n--- Starting report generation for {person} ---")
    
    # First check if we already made this report before (cache check)
    cache_key = _generate_cache_key(cities, person, hobbies, language, zipcodes)
    
    if cache_key in _report_cache:
        print(f"Found it in cache! Using saved report for {person}")
        return _report_cache[cache_key]
    
    print(f"Not in cache - generating NEW report for {person}")
    
    # Get weather data from JSON files
    print("Getting weather data from files...")
    data = IO.get_dict_from_json(zipcodes, cities)
    print(f"Got data for {len(data)} locations")

    # Now we need to create the prompt for the AI
    # We tell the AI what to do step by step
    
    # Step 1: Create system instructions (rules for the AI)
    print("Building prompt for AI...")
    system_rules = "You are a helpful weather reporter. "
    system_rules += "Write a weather report based on the data I give you. "
    system_rules += "Make it sound natural and complete. "
    system_rules += "Write exactly 5 sentences. "
    system_rules += "Don't use bullet points. "
    
    # add person style if provided
    if person:
        system_rules += f"Write it in the style of {person}. "
        print(f"Using style of: {person}")
    
    # add hobbies if provided
    if hobbies:
        hobbies_str = ', '.join(hobbies)
        system_rules += f"Relate weather to these hobbies: {hobbies_str}. "
        print(f"Including hobbies: {hobbies_str}")
    
    # Step 2: Create user message with the actual data
    user_content = f"Language Code: {language}\n"
    user_content += f"Weather Data:\n"
    user_content += f"```json\n{data}\n```\n\n"
    user_content += "Write the report now:"
    
    # Step 3: Format it in Llama 3 template
    # this is important - Llama needs specific format!
    # Note: Don't include <|begin_of_text|> as llama_cpp adds it automatically
    formatted_prompt = f"<|start_header_id|>system<|end_header_id|>\n\n{system_rules}<|eot_id|>"
    formatted_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{user_content}<|eot_id|>"
    formatted_prompt += f"<|start_header_id|>assistant<|end_header_id|>\n\n"
    
    print("Sending to AI model... (this takes a few seconds)")
    
    # Step 4: Call the AI model
    output = llm(
        formatted_prompt,
        max_tokens=500,  # maximum length of response
        temperature=0.3,  # lower = more factual, higher = more creative
        top_p=0.9,  # another parameter for randomness
        stop=["<|eot_id|>", "<|end_of_text|>"]  # when to stop generating
    )
    
    print("AI finished generating!")
    
    # Step 5: Extract the text from AI output
    text = output["choices"][0]["text"].strip()
    
    # sometimes AI adds extra stuff, clean it up
    if "<|assistant|>" in text:
        text = text.split("<|assistant|>")[-1].strip()
    
    print(f"Generated text length: {len(text)} characters")
    
    # Step 6: Save the report to a file
    print("Saving report to file...")
    IO.write_prompt_to_txt(text, person)
    
    # Step 7: Store in cache so we don't have to generate again
    _report_cache[cache_key] = text
    print("Saved to cache!")
    
    print(f"--- Report generation complete for {person} ---\n")
    
    return text