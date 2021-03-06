import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentCoords:any;

  constructor(private http: HttpClient) {
  }

  locateByCoordinates(jsonData:any) {
    console.log("Run test function");
	this.http.get('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/32a8eb0840407bdd23b2b1a9c4b29b11/' + jsonData.lat + ',' + jsonData.lng)
      .subscribe((json: any) => {
		  console.log(json);
		  this.currentCoords = jsonData;
		  this.printWeatherData(json);
      });

  }

  lookupAddressOnGoogle(userInput: HTMLInputElement){
    var searchTerm = userInput.value;
    //Wipe all the html fields.
    document.getElementById("weekAtGlanceField").innerHTML = "";
    document.getElementById("minuteByMinuteField").innerHTML = "";
    document.getElementById("hourByHourField").innerHTML = "";
    document.getElementById("hourByHourTempField").innerHTML = "";
    document.getElementById("oneDayAgoPrecip").innerHTML = "";
    document.getElementById("oneDayAgoTemp").innerHTML = "";
    document.getElementById("oneMonthAgoPrecip").innerHTML = "";
    document.getElementById("oneMonthAgoTemp").innerHTML = "";
    document.getElementById("oneYearAgoPrecip").innerHTML = "";
    document.getElementById("oneYearAgoTemp").innerHTML = "";
    document.getElementById('multiYearAgoPrecip').innerHTML = "";
    document.getElementById('multiYearAgoTemp').innerHTML = "";

    searchTerm.replace(' ', '+');
    let key = 'AIzaSyDJn2Xy60RsDcuC1YDydzkBlzIME7SWCYc';

    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + searchTerm + '&key=' + key)
      .subscribe((json: any) => {
        console.log(json);
        if (json.results.length != 0) { //If there are no results then the address is invalid.
          var location = json.results[0]; //Defaults to first one.
        } else {
          alert("Invalid address. Please try again");
        }
        this.printLocationData(json);
        this.locateByCoordinates(location.geometry.location);
      });
  }

  printLocationData(jsonData:any) {
    let locField = <HTMLElement>document.getElementById('locationDataField');
    locField.innerHTML = "<center><h2>" + jsonData.results[0].formatted_address + "</h2></center>"; //There is a lot more info here, check https://developers.google.com/maps/documentation/geocoding/start for more.
  }

  printWeatherData(weatherJSON:any) {
	if(weatherJSON.currently.icon == "rain") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/l0Iy5fjHyedk9aDGU/giphy.gif')";
	} 
	
	else if(weatherJSON.currently.icon == "clear-day") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/VxbvpfaTTo3le/giphy.gif')";
	}
	
	else if(weatherJSON.currently.icon == "clear-night") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/m5oQabBdoOye4/giphy.gif')";

	}
	
	else if(weatherJSON.currently.icon == "snow") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/wvurizcBk3tmM/giphy.gif')";

	}
	
	else if(weatherJSON.currently.icon == "wind") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/l2JHXMeTJL6BsLyfK/giphy.gif')";

	}
	
	else if(weatherJSON.currently.icon == "thunderstorm") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/DV993b1od2vcs/giphy.gif')";

	}
	
	else if(weatherJSON.currently.icon == "fog") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/J5Vv0RFl0VTEs/giphy.gif')";

	}
	
	else if(weatherJSON.currently.icon == "cloudy") {
		//Leaving as original.
	}
	
	else if(weatherJSON.currently.icon == "partly-cloudy-day") {
		//Leaving as original.
	}
	
	else if(weatherJSON.currently.icon == "partly-cloudy-night") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/9U0RB30SGQtjO/giphy.gif')";

	}
	
	else if(weatherJSON.currently.icon == "tornado") {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/3t5EB2pMKLJni/giphy.gif')";

	}

	else {
		document.body.style.backgroundImage = "url('https://media.giphy.com/media/lE6MQFHe6NREA/giphy.gif')";
		"Seems like we couldn't find the weather around you....";
	}

	//Does the current weather summary
    let weatherField = <HTMLElement>document.getElementById('currentWeatherDataField');
    weatherField.innerHTML = "<center><h2>" + weatherJSON.daily.summary + "</h2></center>";

    //Does the minute by minute summary
      let minField = <HTMLElement>document.getElementById('minuteByMinuteField');
      minField.innerHTML  = "<center><i>Forecast for the next hour: " + weatherJSON.minutely.summary + "</i></center>";
      minField.innerHTML += '<br><br><canvas id="precipChanceGraph" width="1200" height="220" style="border:2px solid #000000; padding-left: 0;\n' +
        '    padding-right: 0;\n' +
        '    margin-left: auto;\n' +
        '    margin-right: auto;\n' +
        '    display: block;\n' +
        '    width: 800px;"></canvas><br>\n';
      let graph = <HTMLCanvasElement>document.getElementById('precipChanceGraph');

      let ctx = graph.getContext("2d");

      //Adds a gradient for the graph.
      var grd=ctx.createLinearGradient(0,220,0,0);
      grd.addColorStop(0,"cyan");
      grd.addColorStop(1,"grey");
      ctx.fillStyle=grd;
      ctx.fillRect(0,0,1200,220);

      ctx.moveTo(0,0);
      for (var i = 0; i < weatherJSON.minutely.data.length; i++)
      {
        ctx.lineTo(i*20, 220 - (weatherJSON.minutely.data[i].precipProbability * 200));
        ctx.stroke();
        if (i%5 ==0) {
          ctx.font = "20px Arial";
          ctx.strokeText(Math.round(weatherJSON.minutely.data[i].precipProbability * 100) + "%",i * 25 + 2, 100);
        }
      }

    //Starts the hour by hour summary.
      let hourField = <HTMLElement>document.getElementById('hourByHourField');
      hourField.innerHTML  = "<center><i>Forecast for the next 48 hours: " + weatherJSON.hourly.summary + "</i></center>";
      hourField.innerHTML += '<br><br><canvas id="hourPrecipChanceGraph" width="1200" height="220" style="border:2px solid #000000; padding-left: 0;\n' +
        '    padding-right: 0;\n' +
        '    margin-left: auto;\n' +
        '    margin-right: auto;\n' +
        '    display: block;\n' +
        '    width: 800px;"></canvas><br>\n';
      let hourGraph = <HTMLCanvasElement>document.getElementById('hourPrecipChanceGraph');

      let hourCtx = hourGraph.getContext("2d");

      //Adds a gradient for the graph.
      var hourGrd=hourCtx.createLinearGradient(0,220,0,0);
      hourGrd.addColorStop(0,"cyan");
      hourGrd.addColorStop(1,"grey");
      hourCtx.fillStyle=hourGrd;
      hourCtx.fillRect(0,0,1200,220);

      hourCtx.moveTo(0,0);
      for (var i = 0; i < weatherJSON.hourly.data.length; i++)
      {
        hourCtx.lineTo(i*25, 220 - (weatherJSON.hourly.data[i].precipProbability * 200));
        hourCtx.stroke();
        if (i%4 ==0) {
          hourCtx.font = "20px Arial";
          hourCtx.strokeText(Math.round(weatherJSON.hourly.data[i].precipProbability * 100) + "%",i * 25 + 2, 100);
        }
      }

      //Hourly summary of temperature with graph.
      let hourTempField = <HTMLElement>document.getElementById('hourByHourTempField');
      hourTempField.innerHTML  += "<br><br><center><i>Hourly Temperature Breakdown: <br>High of " + weatherJSON.daily.data[0].temperatureHigh + ". <br>Low of " + weatherJSON.daily.data[0].temperatureLow + ".</i></center>";
      hourTempField.innerHTML += '<br><br><canvas id="hourTempGraph" width="1200" height="220" style="border:2px solid #000000; padding-left: 0;\n' +
        '    padding-right: 0;\n' +
        '    margin-left: auto;\n' +
        '    margin-right: auto;\n' +
        '    display: block;\n' +
        '    width: 800px;"></canvas><br>\n';
      let hourTempGraph = <HTMLCanvasElement>document.getElementById('hourTempGraph');

      let hourTempCtx = hourTempGraph.getContext("2d");

      //Adds a gradient for the graph.
      var hourTempGrd=hourTempCtx.createLinearGradient(0,220,0,0);
      hourTempGrd.addColorStop(0,"red");
      hourTempGrd.addColorStop(1,"grey");
      hourTempCtx.fillStyle=hourTempGrd;
      hourTempCtx.fillRect(0,0,1200,220);

      hourTempCtx.moveTo(0,0);
      for (var i = 0; i < weatherJSON.hourly.data.length; i++)
      {
        hourTempCtx.lineTo(i*25, 200 - (weatherJSON.hourly.data[i].temperature) * 1.5);
        hourTempCtx.stroke();
        if (i%4 ==0) {
          hourTempCtx.font = "20px Arial";
          hourTempCtx.strokeText(weatherJSON.hourly.data[i].temperature,i * 25, 220 - weatherJSON.hourly.data[i].temperature - 60);
        }
      }

    //Creates a summary of the whole week.
      let dailyField = <HTMLElement>document.getElementById('weekAtGlanceField');
      dailyField.innerHTML = "<center><i>Your week at a glance: " + weatherJSON.daily.summary + "</i></center>";
      dailyField.innerHTML += "<center><h4>Today: " + weatherJSON.daily.data[0].summary +
		" The high is " + weatherJSON.daily.data[0].temperatureHigh + " and the low is " + weatherJSON.daily.data[0].temperatureLow + ".</h4></center>";
      dailyField.innerHTML += "<center><h4>Tomorrow: " + weatherJSON.daily.data[1].summary +
		" The high is " + weatherJSON.daily.data[1].temperatureHigh + " and the low is " + weatherJSON.daily.data[1].temperatureLow + ".</h4></center>";
      dailyField.innerHTML += "<center><h4>2 Days: " + weatherJSON.daily.data[2].summary +
		" The high is " + weatherJSON.daily.data[2].temperatureHigh + " and the low is " + weatherJSON.daily.data[2].temperatureLow + ".</h4></center>";
      dailyField.innerHTML += "<center><h4>3 Days: " + weatherJSON.daily.data[3].summary +
		" The high is " + weatherJSON.daily.data[3].temperatureHigh + " and the low is " + weatherJSON.daily.data[3].temperatureLow + ".</h4></center>";
      dailyField.innerHTML += "<center><h4>4 Days: " + weatherJSON.daily.data[4].summary +
		" The high is " + weatherJSON.daily.data[4].temperatureHigh + " and the low is " + weatherJSON.daily.data[4].temperatureLow + ".</h4></center>";
      dailyField.innerHTML += "<center><h4>5 Days: " + weatherJSON.daily.data[5].summary +
		" The high is " + weatherJSON.daily.data[5].temperatureHigh + " and the low is " + weatherJSON.daily.data[5].temperatureLow + ".</h4></center>";
      dailyField.innerHTML += "<center><h4>6 Days: " + weatherJSON.daily.data[6].summary +
		" The high is " + weatherJSON.daily.data[6].temperatureHigh + " and the low is " + weatherJSON.daily.data[6].temperatureLow + ".</h4></center>";
      dailyField.innerHTML += "<center><h4>7 Days: " + weatherJSON.daily.data[7].summary +
		" The high is " + weatherJSON.daily.data[7].temperatureHigh + " and the low is " + weatherJSON.daily.data[7].temperatureLow + ".</h4></center>";
  }

  useTimeMachine(warpJSON:any, date:any, editthis:HTMLElement, editthis2:HTMLElement) {
	  this.http.get('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/32a8eb0840407bdd23b2b1a9c4b29b11/' + warpJSON.lat + ',' + warpJSON.lng + ',' + date)
      .subscribe((json: any) => {
		  console.log(json);
		  //insert some math here
		  editthis.innerHTML = "<center><i> Hourly Forecast for this day in history: </center></i>";
		  editthis.innerHTML += '<br><br><canvas id="hourPrecipGraph" width="1150" height="220" style="border:2px solid #000000; padding-left: 0;\n' +
        '    padding-right: 0;\n' +
        '    margin-left: auto;\n' +
        '    margin-right: auto;\n' +
        '    display: block;\n' +
        '    width: 800px;"></canvas><br>\n';
		  let oldGraph = <HTMLCanvasElement>document.getElementById('hourPrecipGraph');

          let oldCtx = oldGraph.getContext("2d");

          //Adds a gradient for the graph.
          var oldGrd=oldCtx.createLinearGradient(0,220,0,0);
          oldGrd.addColorStop(0,"cyan");
          oldGrd.addColorStop(1,"grey");
          oldCtx.fillStyle=oldGrd;
          oldCtx.fillRect(0,0,1200,220);

          oldCtx.moveTo(0,0);
          for (var i = 0; i < json.hourly.data.length; i++)
          {
            oldCtx.lineTo(i*50, 220 - (json.hourly.data[i].precipProbability * 200));
            oldCtx.stroke()
            if (i%4 ==0) {
              oldCtx.font = "20px Arial";
              oldCtx.strokeText(Math.round(json.hourly.data[i].precipProbability * 100) + "%",i * 50, 100);
            }
          }

		  //Hourly summary of temperature with graph.
			editthis2.innerHTML  += "<br><br><center><i>Hourly Temperature Breakdown: <br>High of " + json.daily.data[0].temperatureHigh + ". <br>Low of " + json.daily.data[0].temperatureLow + ".</i></center>";
			editthis2.innerHTML += '<br><br><canvas id="hourEditGraph" width="1150" height="220" style="border:2px solid #000000; padding-left: 0;\n' +
		'    padding-right: 0;\n' +
        '    margin-left: auto;\n' +
        '    margin-right: auto;\n' +
        '    display: block;\n' +
        '    width: 800px;"></canvas><br>\n';
			let hourEditGraph = <HTMLCanvasElement>document.getElementById('hourEditGraph');

			let hourEditCtx = hourEditGraph.getContext("2d");

			//Adds a gradient for the graph.
			var hourEditGrd=hourEditCtx.createLinearGradient(0,220,0,0);
			hourEditGrd.addColorStop(0,"red");
			hourEditGrd.addColorStop(1,"grey");
			hourEditCtx.fillStyle=hourEditGrd;
			hourEditCtx.fillRect(0,0,1200,220);

			hourEditCtx.moveTo(0,0);
			for (var i = 0; i < json.hourly.data.length; i++)
			{
				hourEditCtx.lineTo(i*50, 200 - (json.hourly.data[i].temperature) * 1.5);
				hourEditCtx.stroke();
				if (i%4 ==0) {
				hourEditCtx.font = "20px Arial";
				hourEditCtx.strokeText(json.hourly.data[i].temperature,i * 50, 220 - json.hourly.data[i].temperature - 12);
				}
			}

          });
  }


  ngOnInit() {
    let searchButton = document.getElementById('locationSearchButton');
    let userInput = <HTMLInputElement>document.getElementById('locationSearchBox');
    searchButton.addEventListener("click", () => {
      if (userInput.value.length > 0) {
        this.lookupAddressOnGoogle(userInput);
      } else {
        alert("Please enter a search term");
      }
    });

    //Time Machine Buttons
    let todayDate = new Date();
    let tempDate = new Date();
    let tempString = "";
    let oneDayAgoButton = document.getElementById('oneDayAgoButton');
    oneDayAgoButton.addEventListener("click", () => {
      tempDate = todayDate;
      tempString = "";
      tempDate.setDate(todayDate.getDate() - 1);
      console.log(tempDate.getTime());
      document.getElementById('oneDayAgoPrecip').innerHTML = "";
      document.getElementById('oneDayAgoTemp').innerHTML = "";
      document.getElementById('oneMonthAgoPrecip').innerHTML = "";
      document.getElementById('oneMonthAgoTemp').innerHTML = "";
      document.getElementById('oneYearAgoPrecip').innerHTML = "";
      document.getElementById('oneYearAgoTemp').innerHTML = "";
      document.getElementById('multiYearAgoPrecip').innerHTML = "";
      document.getElementById('multiYearAgoTemp').innerHTML = "";
      tempString = tempDate.getTime().toString();
      tempString = tempString.substring(0, tempString.length - 3);
      this.useTimeMachine(this.currentCoords, tempString, document.getElementById('oneDayAgoPrecip'), document.getElementById('oneDayAgoTemp'));
    });
    let oneMonthAgoButton = document.getElementById('oneMonthAgoButton');
    oneMonthAgoButton.addEventListener("click", () => {
      tempDate = todayDate;
      tempString = "";
      tempDate.setMonth(todayDate.getMonth() - 1);
      document.getElementById('oneDayAgoPrecip').innerHTML = "";
      document.getElementById('oneDayAgoTemp').innerHTML = "";
      document.getElementById('oneMonthAgoPrecip').innerHTML = "";
      document.getElementById('oneMonthAgoTemp').innerHTML = "";
      document.getElementById('oneYearAgoPrecip').innerHTML = "";
      document.getElementById('oneYearAgoTemp').innerHTML = "";
      document.getElementById('multiYearAgoPrecip').innerHTML = "";
      document.getElementById('multiYearAgoTemp').innerHTML = "";
      tempString = tempDate.getTime().toString();
      tempString = tempString.substring(0, tempString.length - 3);
      this.useTimeMachine(this.currentCoords, tempString, document.getElementById('oneMonthAgoPrecip'), document.getElementById('oneMonthAgoTemp'));
    });
    let oneYearAgoButton = document.getElementById('oneYearAgoButton');
    oneYearAgoButton.addEventListener("click", () => {
      tempDate = todayDate;
      tempString = "";
      tempDate.setFullYear(todayDate.getFullYear() - 1);
      document.getElementById('oneDayAgoPrecip').innerHTML = "";
      document.getElementById('oneDayAgoTemp').innerHTML = "";
      document.getElementById('oneMonthAgoPrecip').innerHTML = "";
      document.getElementById('oneMonthAgoTemp').innerHTML = "";
      document.getElementById('oneYearAgoPrecip').innerHTML = "";
      document.getElementById('oneYearAgoTemp').innerHTML = "";
      document.getElementById('multiYearAgoPrecip').innerHTML = "";
      document.getElementById('multiYearAgoTemp').innerHTML = "";
      tempString = tempDate.getTime().toString();
      tempString = tempString.substring(0, tempString.length - 3);
      this.useTimeMachine(this.currentCoords, tempString, document.getElementById('oneYearAgoPrecip'), document.getElementById('oneYearAgoTemp'));
    });
    let multiYearAgoButton = document.getElementById('multiYearAgoButton');
    multiYearAgoButton.addEventListener("click", () => {
      tempDate = todayDate;
      tempString = "";
      let selectorValue = <HTMLSelectElement>document.getElementById('yearSelect');
      let offset = selectorValue.selectedIndex + 1;
      tempDate.setFullYear(todayDate.getFullYear() - offset);
      document.getElementById('oneDayAgoPrecip').innerHTML = "";
      document.getElementById('oneDayAgoTemp').innerHTML = "";
      document.getElementById('oneMonthAgoPrecip').innerHTML = "";
      document.getElementById('oneMonthAgoTemp').innerHTML = "";
      document.getElementById('oneYearAgoPrecip').innerHTML = "";
      document.getElementById('oneYearAgoTemp').innerHTML = "";
      document.getElementById('multiYearAgoPrecip').innerHTML = "";
      document.getElementById('multiYearAgoTemp').innerHTML = "";
      tempString = tempDate.getTime().toString();
      tempString = tempString.substring(0, tempString.length - 3);
      this.useTimeMachine(this.currentCoords, tempString, document.getElementById('multiYearAgoPrecip'), document.getElementById('multiYearAgoTemp'));
    });



    /**
     * Returned JSON is formatted like this:
     * {
          "latitude": 42.3601,
          "longitude": -71.0589,
          "timezone": "America/New_York",
          "currently": {
              "time": 1509993277,
              "summary": "Drizzle",
              "icon": "rain",
              "nearestStormDistance": 0,
              "precipIntensity": 0.0089,
              "precipIntensityError": 0.0046,
              "precipProbability": 0.9,
              "precipType": "rain",
              "temperature": 66.1,
              "apparentTemperature": 66.31,
              "dewPoint": 60.77,
              "humidity": 0.83,
              "pressure": 1010.34,
              "windSpeed": 5.59,
              "windGust": 12.03,
              "windBearing": 246,
              "cloudCover": 0.7,
              "uvIndex": 1,
              "visibility": 9.84,
              "ozone": 267.44
          },
          "minutely": {
              "summary": "Light rain stopping in 13 min., starting again 30 min. later.",
              "icon": "rain",
              "data": [{
                  "time": 1509993240,
                  "precipIntensity": 0.007,
                  "precipIntensityError": 0.004,
                  "precipProbability": 0.84,
                  "precipType": "rain"
              },
            ...
            ]
          },
          "hourly": {
              "summary": "Rain starting later this afternoon, continuing until this evening.",
              "icon": "rain",
              "data": [{
                  "time": 1509991200,
                  "summary": "Mostly Cloudy",
                  "icon": "partly-cloudy-day",
                  "precipIntensity": 0.0007,
                  "precipProbability": 0.1,
                  "precipType": "rain",
                  "temperature": 65.76,
                  "apparentTemperature": 66.01,
                  "dewPoint": 60.99,
                  "humidity": 0.85,
                  "pressure": 1010.57,
                  "windSpeed": 4.23,
                  "windGust": 9.52,
                  "windBearing": 230,
                  "cloudCover": 0.62,
                  "uvIndex": 1,
                  "visibility": 9.32,
                  "ozone": 268.95
              },
            ...
            ]
          },
         "daily": {
              "summary": "Mixed precipitation throughout the week, with temperatures falling to 39°F on Saturday.",
              "icon": "rain",
              "data": [{
                  "time": 1509944400,
                  "summary": "Rain starting in the afternoon, continuing until evening.",
                  "icon": "rain",
                  "sunriseTime": 1509967519,
                  "sunsetTime": 1510003982,
                  "moonPhase": 0.59,
                  "precipIntensity": 0.0088,
                  "precipIntensityMax": 0.0725,
                  "precipIntensityMaxTime": 1510002000,
                  "precipProbability": 0.73,
                  "precipType": "rain",
                  "temperatureHigh": 66.35,
                  "temperatureHighTime": 1509994800,
                  "temperatureLow": 41.28,
                  "temperatureLowTime": 1510056000,
                  "apparentTemperatureHigh": 66.53,
                  "apparentTemperatureHighTime": 1509994800,
                  "apparentTemperatureLow": 35.74,
                  "apparentTemperatureLowTime": 1510056000,
                  "dewPoint": 57.66,
                  "humidity": 0.86,
                  "pressure": 1012.93,
                  "windSpeed": 3.22,
                  "windGust": 26.32,
                  "windGustTime": 1510023600,
                  "windBearing": 270,
                  "cloudCover": 0.8,
                  "uvIndex": 2,
                  "uvIndexTime": 1509987600,
                  "visibility": 10,
                  "ozone": 269.45,
                  "temperatureMin": 52.08,
                  "temperatureMinTime": 1510027200,
                  "temperatureMax": 66.35,
                  "temperatureMaxTime": 1509994800,
                  "apparentTemperatureMin": 52.08,
                  "apparentTemperatureMinTime": 1510027200,
                  "apparentTemperatureMax": 66.53,
                  "apparentTemperatureMaxTime": 1509994800
              },
            ...
            ]
          },
          "alerts": [
          {
            "title": "Flood Watch for Mason, WA",
            "time": 1509993360,
            "expires": 1510036680,
            "description": "...FLOOD WATCH REMAINS IN EFFECT THROUGH LATE MONDAY NIGHT...\nTHE FLOOD WATCH CONTINUES FOR\n* A PORTION OF NORTHWEST WASHINGTON...INCLUDING THE FOLLOWING\nCOUNTY...MASON.\n* THROUGH LATE FRIDAY NIGHT\n* A STRONG WARM FRONT WILL BRING HEAVY RAIN TO THE OLYMPICS\nTONIGHT THROUGH THURSDAY NIGHT. THE HEAVY RAIN WILL PUSH THE\nSKOKOMISH RIVER ABOVE FLOOD STAGE TODAY...AND MAJOR FLOODING IS\nPOSSIBLE.\n* A FLOOD WARNING IS IN EFFECT FOR THE SKOKOMISH RIVER. THE FLOOD\nWATCH REMAINS IN EFFECT FOR MASON COUNTY FOR THE POSSIBILITY OF\nAREAL FLOODING ASSOCIATED WITH A MAJOR FLOOD.\n",
            "uri": "http://alerts.weather.gov/cap/wwacapget.php?x=WA1255E4DB8494.FloodWatch.1255E4DCE35CWA.SEWFFASEW.38e78ec64613478bb70fc6ed9c87f6e6"
          },
          ...
          ],
          {
            "flags": {
              "units": "us",
              ...
            }
          }
     */
  }
}
