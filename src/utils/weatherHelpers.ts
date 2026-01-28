// Helper function to map overcast from JSON (englisch) to German condition names
export const mapOvercastToCondition = (overcast: string): string => {
  switch (overcast.toLowerCase()) {
    case 'clear':
      return 'Sonnig';
    case 'partly cloudy':
      return 'Teilweise bewölkt';
    case 'cloudy':
      return 'Bewölkt';
    case 'rainy':
      return 'Regnerisch';
    case 'snowy':
      return 'Schnee';
    case 'windy':
      return 'Windig';
    case 'fog':
      return 'Nebelig';
    case 'stormy':
      return 'Gewitter';
    default:
      return 'Unbekannt';
  }
};

// Helper function to get weather icon based on German condition string
export const getWeatherIcon = (condition: string): string => {
  const cond = condition.toLowerCase();

  if (cond.includes('reg')) {
    return '/weather-icons/regnerisch.png';
  } else if (cond.includes('bewölkt') || cond.includes('bewolkt')) {
    return '/weather-icons/bewolkt.png';
  } else if (cond.includes('schnee')) {
    return '/weather-icons/schnee.png';
  } else if (cond.includes('gewitter')) {
    return '/weather-icons/gewitter.png';
  } else if (cond.includes('nebel')) {
    return '/weather-icons/nebelig.png';
  } else if (cond.includes('windig')) {
    return '/weather-icons/windig.png';
  } else if (cond.includes('sonnig')) {
    return '/weather-icons/sonnig.png';
  } else {
    return '/weather-icons/fehler.png';
  }
};

// (Optional: falls du Emojis auch nutzt wie bisher)
export const getWeatherEmoji = (condition: string): string => {
  if (condition.includes('Regnerisch') || condition.includes('regen')) {
    return '🌧️';
  } else if (condition.includes('bewölkt') || condition.includes('Bewölkt')) {
    return '☁️';
  } else if (condition.includes('Schnee')) {
    return '❄️';
  } else if (condition.includes('Gewitter')) {
    return '⛈️';
  } else if (condition.includes('Nebelig')) {
    return '🌫️';
  } else if (condition.includes('Windig')) {
    return '💨';
  } else if (condition.includes('Sonnig')) {
    return '☀️';
  } else {
    return '🌤️';
  }
};
