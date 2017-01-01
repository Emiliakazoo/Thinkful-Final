$(function() {
    $(".representatives-container").hide();
    $(".donors-container").hide();

    var showRepresentatives = function(reps){
        //clone code goes here
        var result = $('.templates .representative').clone();

        var yourRepName = result.find(".rep-name");
        yourRepName.text(reps["@attributes"].firstlast + "(" + reps["@attributes"].party + ")");


        var yourRepDonors= result.find(".rep-donors");
        var repDonorLink = "api/contributors/" + reps["@attributes"].cid;
        yourRepDonors.attr("href", repDonorLink);
        yourRepDonors.text("Donors");

        var repEmail = result.find(".contact-me a");
        repEmail.attr("href", reps["@attributes"].webform);
        repEmail.text(reps["@attributes"].webform);

        var repWebsite = result.find(".gov-website a");
        repWebsite.attr("href", reps["@attributes"].website);
        repWebsite.text(reps["@attributes"].website);

        var repPhone = result.find(".phone-num span + span");
        repPhone.text(reps["@attributes"].phone);

        var repTwitter = result.find(".rep-twitter a");

        if(reps["@attributes"].twitter_id) {
            var twitterLink = "http://twitter.com/" + reps["@attributes"].twitter_id;
            repTwitter.attr("href", twitterLink);
            repTwitter.text("@" + reps["@attributes"].twitter_id);
        }

        //return the clone result
        return result;
    };

    var showDonors = function(repDonors){
        var result = $(".templates .donor").clone();
        var donorName = result.find(".donor-name");
        donorName.text(repDonors["@attributes"].org_name);

        var donationAmount = result.find(".donation-amount");
        var formattedDA = $.number(repDonors["@attributes"].total); 
        donationAmount.text("$" + formattedDA);


        return result;
    };

    //____________________________________________BEGIN get reps based on state ID such a CA or NY
    $(".get-reps").on("submit", function(e) {
        e.preventDefault();
        $(".representatives").empty();
        $(".donors").empty();
        $(".receiving-rep").empty();
        var state = $("#state").val();

        var repList = "http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&output=json&apikey=15896170d79aff1bdd2a33b74dbcebe8";

        $.ajax({
            url: '/api',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: repList })

        }).done(function(data) {
            $.each(data.response.legislator, function(i, item) {

                var requestedReps = showRepresentatives(item);
                $(".representatives").append(requestedReps);

        $(".representatives-container").show();

            $('html,body').animate({
               scrollTop: $("#top").offset().top
             },'fast');
           });
       });

    });

    //____________________________________________END get reps based on state ID such a CA or NY







    //____________________________________________BEGIN get donors based on CID number

    $(".representatives").on("click", ".representative .rep-donors", function(e) {
        e.preventDefault();
        $(".donors").empty();
        $(".receiving-rep").empty();
            $(".close").click(function(){
        $(".donors-container").hide();
    })


        var anchorEndpoint = $(this).attr("href");
        var arr = anchorEndpoint.split("");
        var representativesCID = arr.slice(17).join("");        
        var donors = "http://www.opensecrets.org/api/?method=candContrib&cid=" + representativesCID + "&cycle=2016&output=json&apikey=15896170d79aff1bdd2a33b74dbcebe8";
        $.ajax({
            url: '/api',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: donors })

        }).done(function(data) {
           $.each(data.response, function(i, item) {
                var receivingRep = item["@attributes"].cand_name;
                $.each(item.contributor, function(i, donoritem){
                    var representativeDonors = showDonors(donoritem);
                    $(".receiving-rep").text(receivingRep);
                    $(".donors").append(representativeDonors);
                    $(".donors-container").show();

                })
                //$(".donors").append("<li>" +item["@attributes"].org_name+ ": " + "$" +item["@attributes"].total+   "</li>")
            });
        });

    });

       //____________________________________________BEGIN get donors based on CID number

});
