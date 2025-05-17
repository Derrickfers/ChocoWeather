let placeName = document.querySelector(".weather-place")
let dateTime = document.querySelector(".weather-date-time")
let weatherIcon = document.querySelector(".weather-icon-sunny")
let temperature = document.querySelector(".temperature")
let weatherMin = document.querySelector(".weather-min")
let weatherMax = document.querySelector(".weather-max")
let description = document.querySelector(".description")


let weatherFeelsLike = document.querySelector(".weather-feelsLike")
let weatherHumidity = document.querySelector(".weather-humidity")
let weatherWind = document.querySelector(".weather-wind")
let weatherPressure = document.querySelector(".weather-pressure")

let searchBox = document.querySelector(".search-box")
let inputValue = document.querySelector(".inputValue")

// get country name
const getCountryName = (code) => {
    const locale = navigator.language || "en";
    return new Intl.DisplayNames([locale], { type: "region" }).of(code);
};

// get Date & Time
const getDateTime = (dt) => {
   const curDate = new Date(dt * 1000);
   console.log(curDate);
   
   const options = {
     weekday: "long",    // "week"
     month: "short",     // "month"
     day: "numeric",     // "day date"
     year: "numeric",    // "year date"
     hour: "2-digit",    // "hours number"
     minute: "2-digit",  // "minutes number"
     hour12: true        // "AM/PM"
   };
   
   const formatter = new Intl.DateTimeFormat("en-US", options);
   
   const formatedDate = formatter.format(curDate)
   
   // console.log(formatedDate);
   return formatedDate;
};

// Input box get name
let city = "aldona"; 
searchBox.addEventListener("submit", (e) => {
e.preventDefault(); 
// console.log(inputValue.value);
 city = inputValue.value.trim();

 fetchWeatherData();

 inputValue.value = "";      
});

// Api fetch current temperature
const fetchWeatherData = async() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e728a99fd22151512f1e28191fa7842e`;

    // const apiUrl = `httpssgrg://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={e728a99fd22151512f1e28191fa7842e}`;
     try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log(data);

        const { main, name, weather, wind, sys, dt } = data;
        placeName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
        dateTime.innerHTML = `${getDateTime(dt)}`; 

        temperature.innerHTML = `${Math.floor(main.temp - 273.15)}&#176;C`; 
        weatherMin.innerHTML = `Min: ${(main.temp_min - 273.15).toFixed(1)}&#176;C`;
        weatherMax.innerHTML = `Max: ${(main.temp_max - 273.15).toFixed(1)}&#176;C`;

        description.innerHTML = weather[0].main;
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`; 
        
        
        weatherFeelsLike.innerHTML = `${main.feels_like.toFixed()}&#176`; 
        weatherHumidity.innerHTML = `${main.humidity.toFixed()}&#176`; 
        weatherWind.innerHTML = `${wind.speed.toFixed()}&#176`; 
        weatherPressure.innerHTML = `${main.pressure.toFixed()}&#176`; 

     } catch (error) {
        console.log(error);
        
     }
};

// Api fetch current temperature loading
window.addEventListener("load", fetchWeatherData);




 //  24hrs forcast part ----------------------------------------------------------------------
 const track = document.querySelector('.forecast');
 
 const displayHourlyForecast = (hourData) => {
  const currentHour = new Date().setMinutes(0, 0, 0);
  const net24Hours = currentHour  + 24 * 60 * 60 * 1000;

    const next24HoursData =  hourData.filter(({time}) => {
      const forecastTime = new Date(time).getTime(); 
        return forecastTime >= currentHour && forecastTime <= net24Hours;
        
      }); 
      
      const hourlyweatherHtml = next24HoursData.map(items => {
        const temperature = Math.floor(items.temp_c);
        const time = items.time;
        const icon = items.condition.icon;
        // <img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />

        

        return `<li class="day">${time}<br><span><img src="${icon}"/><br>${temperature}</span></li>`;
      }).join("");   
               
          console.log(hourlyweatherHtml);
                
          track.innerHTML = hourlyweatherHtml;
 
// slide rtl bar scroll start -------- 
const items = track.querySelectorAll('.day');
const itemss = track.querySelector('.day');
if (!itemss) return;

const itemWidth = itemss.getBoundingClientRect().width;
// const itemWidth = 106;
// console.log(itemWidth);

let currentPosition = 0;

const updateMaxPosition = () => {
  const containerWidth = track.parentElement.getBoundingClientRect().width;  
  const visibleItems =  (containerWidth / itemWidth);
   
  const totalItems = items.length;
  // console.log(containerWidth);
  // console.log(itemWidth);
  // console.log(visibleItems);
  
  // console.log(-itemWidth * (totalItems - visibleItems));
  return -itemWidth * (totalItems - visibleItems);
};

let maxPosition = updateMaxPosition();

// Recalculate maxPosition on window resize
window.addEventListener('resize', () => {
  maxPosition = updateMaxPosition();

  // Ensure we don't scroll beyond new limits after resize
  if (currentPosition < maxPosition) {
    currentPosition = maxPosition;
    track.style.transform = `translateX(${currentPosition}px)`;
  }
});
 
 // In RTL, left arrow moves content to the RIGHT (i.e., slider goes to earlier items)
 document.querySelector('.right-arrow').addEventListener('click', () => {
   if (currentPosition > maxPosition) {   
     currentPosition -= itemWidth;
     if (currentPosition < maxPosition) {
      currentPosition = maxPosition;
    }
    //  console.log(currentPosition);
     track.style.transform = `translateX(${currentPosition}px)`;
   }
 });
 
 // In RTL, right arrow moves content to the LEFT (i.e., slider goes to later items)
 document.querySelector('.left-arrow').addEventListener('click', () => {
   if (currentPosition < 0) {
     currentPosition += itemWidth;
     if (currentPosition > 0) {
      currentPosition = 0;
    }
    //  console.log(currentPosition);
     track.style.transform = `translateX(${currentPosition}px)`;
   }
 });

 // slide rtl bar scroll end --------
        
 };

 
//  fetch api daily/24hrs forcast 
const API_KEY = `44e48d20c907432caf7124947251505`;

const fetchWeatherData2 = async() => {
const apiUrl2 = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=2`;

try {
    const resi = await fetch(apiUrl2);
    const datas = await resi.json(); 
    console.log(datas);

    const combineHourData = [...datas.forecast.forecastday[0].hour, ...datas.forecast.forecastday[1].hour,]

    // console.log(combineHourData);

    displayHourlyForecast(combineHourData); 

     
} catch (error) {
   console.log(error);
   
}
};

  
 window.addEventListener("load", fetchWeatherData2);
