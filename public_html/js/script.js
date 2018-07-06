/* 
    Created on : 05-Jul-2018, 15:10:52
    Author     : Rakshith
*/


/* Event : getCities 
 * parameters : queryStr - Manually entered search key to find cities 
 * 
 * Implementation : Get list of cities from the different countries matches with the user entered keyword and user selects the city from the given list
 * 
 * Test cases : 1) No city found - Displays error message if the user entered city not found
 *              2) No response found - Displays alert message with status code if no response is found
 */
function getCities(queryStr) {
    var obj = {q: queryStr};
    callRequest(CITIES_URL, "GET", obj, function (respData) {
        console.log(respData);
        if (respData.status == "success") {
            $(".search_results_holder").show();
            if (respData.location_suggestions.length > 0) {
                var cities = respData.location_suggestions;
                var html = "";
                for (var i = 0; i < cities.length; i++) {
                    var eachItem = cities[i];
                    var div = "<div class=\"cities_result_holder\" id=\"" + eachItem.id + "\">" +
                            "<div class=\"cities_img_block\">" +
                            "<img src=\"" + eachItem.country_flag_url + "\" class=\"search_item_flag\" />" +
                            "</div>" +
                            "<div class=\"cities_data_block\">" +
                            "<div id=\"cities_name_state\">" + eachItem.name + ", " + eachItem.state_name + "</div>" +
                            "<div id=\"cities_country\">" + eachItem.country_name + "</div>" +
                            "</div>" +
                            "</div>";

                    html += div;
                }
                $("#searchBoxResults").html(html);
            } else {
                $("#searchBoxResults").html("--No results found, Try for different city--");
            }
        }
    });
}

/* Event : getCollections 
 * parameters : cityID - valid city ID to get collection of restaurants from the selected city 
 * 
 * Implementation : Get types of restaurant from the selected city
 * 
 * Test cases : 1) No collections found - Displays error message if no restaturant collections is found.
 *              2) No response found - Displays alert message with status code if no response is found
 */
function getCollections(cityID) {
    var obj = {city_id: cityID};
    callRequest(CITY_COLLECTIONS_URL, "GET", obj, function (respData) {
        if (respData.collections) {
            $(".collections_error_msg").hide();
            var collections = respData.collections;
            var html = "";
            console.log(collections);
            for (var i = 0; i < collections.length; i++) {
                var collection = collections[i];
                console.log(collection);
                var div = "<div class=\"col-md-4 col-sm-12 col-xs-12\">" +
                        "<div class=\"collection_box\">" +
                        "<div class=\"collection_header\">" +
                        "<div class=\"collection_title\">" +
                        collection.collection.title +
                        "</div>" +
                        "<div class=\"collection_desc\">" +
                        collection.collection.description +
                        "</div>" +
                        "</div>" +
                        "<div class=\"collection_footer\">" +
                        "<a class=\"collection_link\" href=\"" + collection.collection.url + "\" target=\"_blank\">" +
                        "(View more)" +
                        "</a>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                html += div;
            }

            $("#collectionsHolder").html(html);
        } else {
            $(".collections_error_msg").show();
        }

    });
}

/* Event : callRequest 
 * parameters : 1)url - Specific URL to fetch response
 *              2) type - Define HTTP type to fetch data (eg: GET,POST)
 *              3) obj -  The optional obj parameter specifies some data to send along with the request.
                4) callback - The callback parameter is the name of a callback function that replies with the success response data 
 * 
 * Implementation : Event to make ajax network call to fecth data from the given URL
 * 
 * Test cases : 1) success - send response data with callback function
 *              2) error -  alerts error status code 
 */
function callRequest(url, type, obj, callback) {
    $.ajax({
        url: url,
        type: type,
        async: false,
        dataType: 'json',
        data: obj,
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('user-key',
                    '89fdee0480bdc77b80f5e41cfd2b8c0a');
        },
        success: function (data) {
            callback(data);
        },
        error: function (ex) {
            alert(ex.responseText);
        }
    });

}

$(document).ready(function () {
    
    /* Trigger method while user enters keyword for city */
    $("#search_box").on("keyup", function (e) {
        getCities($("#search_box").val());
    })
    
    /* Trigger method while user clicks selected city from the list */
    $(document).on("click", ".cities_result_holder", function () {
        $("#collectionsHolder div").html('');
        var selectedCity = $(this).find("#cities_name_state").html();
        $("#search_box").val(selectedCity);
        $(".search_results_holder").hide();
        getCollections($(this).attr('id'));
    })

});

