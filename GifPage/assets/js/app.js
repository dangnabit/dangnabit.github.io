$(document).ready(function() {

    // caching jQuery elements
    var $imageDisplay = $('#imageDisplay');
    var $reactionInput = $('#reaction-input');
    var $btnList = $('#btnList');
    var $addReaction = $('#add-reaction');
    var $saveBtn = $('#saveBtn');
    var $loadBtn = $('#loadBtn');

    var reactionButtons = ['Shock', 'Awe', 'Angry', 'Happy', 'Surprise', 'Scared', 'Excited', 'Bored'];

    var renderGifs = function(reaction) {

        if (typeof reaction !== 'string') {
            var reactionLbl = $(this).attr("data-reaction");
        } else {
            reactionLbl = reaction;
        }

        var offsetRand = 10 * Math.floor(Math.random() * 50);

        $('.reactBtn').each(function() {
            $(this).removeClass('btn-info');
        });

        $(this).toggleClass('btn-info');

        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + reactionLbl + "&api_key=dc6zaTOxFJmzC&limit=10&offset=" + offsetRand;

        console.log(queryURL);

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                var results = response.data;

                if (results.length < 1) {
                    return renderGifs();
                }

                $imageDisplay.empty();

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $('<div>');

                    var rating = results[i].rating;

                    var p = $('<p>').text('Rating: ' + rating);

                    var reactionImage = $('<img>');

                    reactionImage.attr('src', results[i].images.fixed_height_still.url);
                    reactionImage.addClass('gifs');
                    reactionImage.attr('data-still', results[i].images.fixed_height_still.url);
                    reactionImage.attr('data-animate', results[i].images.fixed_height.url);
                    reactionImage.attr('data-state', 'still');
                    reactionImage.attr('alt', reactionLbl + " Gif");

                    gifDiv.append(reactionImage);
                    gifDiv.append(p);

                    gifDiv.addClass('col-sm-6');

                    $imageDisplay.prepend(gifDiv);
                }
            });
    }

    var gifClick = function(gif) {
        var state = $(this).attr('data-state');

        if (state == 'still') {
            $(this).attr('src', $(this).attr('data-animate'));
            $(this).attr('data-state', 'animate');
        } else {
            $(this).attr('src', $(this).attr('data-still'));
            $(this).attr('data-state', 'still');
        }

    }

    var removeBtn = function(button) {
        var reactionName = $(this).attr("data-reaction");
        var index = reactionButtons.indexOf(reactionName);

        if (index > -1) {
            reactionButtons.splice(index, 1);
        }

        $(this).parent().remove();
    }

    var addBtn = function() {

        var reaction = $reactionInput.val().trim();
        
        if (reaction !== "") {
            reactionButtons.unshift(reaction);
        }
        $reactionInput.val('');
        renderButtons();
    }

    var renderButtons = function() {
        $btnList.empty();
        for (var i = 0; i < reactionButtons.length; i++) {
            var div = $('<div>');
            var btn = $("<button>");
            var x = $('<button>');
            x.text('x');
            x.addClass('btn btn-warning xBtn');
            x.attr("data-reaction", reactionButtons[i]);
            btn.addClass("btn btn-primary reactBtn");
            btn.attr("data-reaction", reactionButtons[i]);
            btn.text(reactionButtons[i]);

            div.append(btn);
            div.append(x);
            $btnList.append(div);

        }
    }

    var saveButtonArray = function() {
        var buttonStr = JSON.stringify(reactionButtons);
        localStorage.setItem('gifButtons', buttonStr);
        $loadBtn.removeClass('hidden');
    }

    var loadButtonArray = function() {
        reactionButtons = JSON.parse(localStorage.getItem('gifButtons'));
        renderButtons();
    }



    if (localStorage.getItem('gifButtons')) {
        $loadBtn.removeClass('hidden');
    }

    $loadBtn.on('click', loadButtonArray)

    $saveBtn.on('click', saveButtonArray)

    $(document).on("click", ".xBtn", removeBtn);

    $(document).on("click", ".reactBtn", renderGifs);

    $(document).on("click", ".gifs", gifClick);

    $addReaction.on("click", function(event) {
      event.preventDefault();
      addBtn();
    });



    renderButtons();
    renderGifs('Laughing');
});
