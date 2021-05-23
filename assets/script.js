const APIkey = 'c57ae5b10c4d20cec47d43402eb17ea6'


$(document).ready(function () {
    let date = moment().format("YYYY-MM-DD")

    console.log(date);

    function storeCity() {
        $('.searchedCities').empty()
        let pastSearches = JSON.parse(localStorage.getItem('cities')) || []
        for (let i = 0; i < pastSearches.length; i++) {
            while (pastSearches.length > 5) {
                let pastFive = pastSearches.length - 5;
                let index = 0;
                pastSearches.splice(index, pastFive);
                index++;
            }
            let newSearch = $('<li>')
            newSearch.addClass("list-group-item");
            newSearch.text(pastSearches[i].name)
            $('.searchedCities').append(newSearch);
        }
    }
    storeCity()

    $(".button").on("click", function (event) {
        event.preventDefault();

        let city = $('.form-control').val()

        let pastSearches = JSON.parse(localStorage.getItem('cities')) || []
        $('.searchedCities').val(pastSearches);
        let savedCity = {name: city};
        pastSearches.push(savedCity);
        localStorage.setItem('cities', JSON.stringify(pastSearches));

        storeCity()
        run(city);
    })

    $('.searchedCities').on('click', "li", function (event) {
        event.preventDefault();
        let city = $(this).text()
        run(city);
    })
    function run(city) {
        $(".fivedays").show()
        let apiURL1 = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=c57ae5b10c4d20cec47d43402eb17ea6'
        
        $.when(
            $.ajax({
                url: apiURL1,
                method: "GET"
            })
        )
        .then(function (response) {
            let latitude = response.coord.lat;
            let longitude = response.coord.lat;
            let apiURL2 = 'https://api.openweathermap.org/data/2.5/uvi?appid=c57ae5b10c4d20cec47d43402eb17ea6&lat=' + latitude + '&lon=' + longitude;

            $.ajax({
                url: apiURL2,
                method: "GET"
            })
            .then(function (response2) {
                $('.usercity').empty();

                let cityName = response.name;
                let temp = (response.main.temp - 273.15) * 9 / 5 + 32
                let fahrenheit = $('<p>')
                let humidity = $('<p>')
                
                
                let indexEl = $('<span>');
                indexEl.text("UV Index: ");
                let returnIndex = parseFloat(response2.value)
                let returnIndexEl = $('<span>');
                returnIndexEl.text(returnIndex);
                returnIndexEl.attr('id', 'index-number');

                if (returnIndex <= 2) {
                    returnIndexEl.addClass('d-inline p-2 bg-success text-white')
                } else if (returnIndex >= 3 && returnIndex <=7) {
                    returnIndexEl.addClass('d-inline p-2 bg-warning text-white')
                } else {
                    returnIndexEl.addClass('d-inline p-2 bg-danger text-white')
                }

                let iconcode = response.weather[0].icon;
                fahrenheit.text("Temp: " + temp.toFixed(1) + "°F")
                humidity.text("Humidity: " + response.main.humidity + '%')
                

                let icons = 'https://openweathermap.org/img/w/' + iconcode + ".png"
                let iconDisplay = $('<img>')
                iconDisplay.attr('src', icons);
                $('.usercity').append(cityName + ": " + date);
                
                $('.usercity').append(iconDisplay);
                $('.usercity').append(fahrenheit);
                $('.usercity').append(humidity);
                $('.usercity').append(indexEl);
                $('.usercity').append(returnIndexEl);
                
            })
            
            let apiURL3 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIkey
            $.ajax({
                url: apiURL3,
                method: "GET"
            })
                .then(function (response3) {
                    $('#1').empty();
                    $('#2').empty();
                    $('#3').empty();
                    $('#4').empty();
                    $('#5').empty();
                    let day1 = $('<h5>');
                    let day2 = $('<h5>');
                    let day3 = $('<h5>');
                    let day4 = $('<h5>');
                    let day5 = $('<h5>');
                    day1.text(moment(date).add(1, 'days').format("MMM Do"));
                    day2.text(moment(date).add(2, 'days').format("MMM Do"));
                    day3.text(moment(date).add(3, 'days').format("MMM Do"));
                    day4.text(moment(date).add(4, 'days').format("MMM Do"));
                    day5.text(moment(date).add(5, 'days').format("MMM Do"));
                    $('#1').append(day1);
                    $('#2').append(day2);
                    $('#3').append(day3);
                    $('#4').append(day4);
                    $('#5').append(day5);
                

                let x = 1
                for (let i = 0; i < response3.list.length; i++) {
                    if (response3.list[i].dt_txt.indexOf("12:00:00") !== -1 &&
                        response3.list[i].dt_txt.indexOf("15:00:00") !== -1 ||
                        response3.list[i].dt_txt.indexOf("18:00:00") !== -1) {
                           let selector = "#" + x;
                           let temperatureDisplay = (response3.list[i].main.temp_max - 273.15) * 9 / 5 + 32
                           let humidityDisplay = $('<p>');
                           let fahrenheitDisplay = $('<p>');
                           let weatherDisplay = response3.list[i].weather[0].icon;
                           let iconDisplay = 'https://openweathermap.org/img/wn/' + weatherDisplay + ".png";
                           let iconDisplayOne = $('<img>')
                           iconDisplayOne.attr('src', iconDisplay);
                           fahrenheitDisplay.text("Temperature: " + temperatureDisplay.toFixed(1) + "°F");
                           humidityDisplay.text("Humidity: " + response3.list[i].main.humidity + '%');
                           $(selector).append(fahrenheitDisplay);
                           $(selector).append(humidityDisplay);
                           $(selector).append(iconDisplayOne);
                           x++;


                       }
                }
        })
    })
}
});