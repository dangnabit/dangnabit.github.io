$(document).ready(function() {

    //delare variable for the game
    var wins = 0;
    var loss = 0;
    var score = 0;
    var target;
    var crysVal = [];
    var turns = 0;
    var ruleClk = 0;
    var rulesShown = true;
    var ruleBtnClk = 0;
    // caching jQuery elements for easy reference
    var $targetScore = $("#targetScore");
    var $currentScore = $("#currentScore");
    var $crystal = $(".crystal");
    var $turns = $("#turns");
    var $wins = $("#wins");
    var $losses = $("#losses");
    var $rules = $("#rules");
    var $ruleBtn = $(".rules")
    var $hideBtn = $("#hideBtn");



    //Function for when any crystal is clicked
    gemClick = function(crys) {
        var ammount = crysVal[$(crys).attr("crys")];
        score = score + ammount;
        $currentScore.text(score);
    }


    //randomly generates target number for the game
    generateTarget = function() {
        target = 19 + Math.floor(Math.random() * 100);
        $targetScore.text(target);
    }

    //creates the values for each crystal in an array. 
    generateCrysVal = function() {
        crysVal = []; //empties Value array

        //while loop runs until crysVal has 4 values. If statement checks each entry against the current random value to make sure no crystals have duplicates. 
        while (crysVal.length < 4) {
            var tempRand = Math.ceil(Math.random() * 12);
            if ($.inArray(tempRand, crysVal) == -1) {
                crysVal.push(tempRand);
            }
        }
    }

    //new game funtion to get us reset back to the initial 
    newGame = function() {
        generateTarget();
        generateCrysVal();
        score = 0;
    }

    //itterates the turn counter and rewrites it to the DOM
    turnsUp = function() {
        turns++;
        $turns.text(turns);
    }

    //toggles the rules div in the DOM
    toggleRules = function() {
        if (rulesShown) {
            $rules.fadeOut('slow', function() {

            });
            $(".hideBtn").text("Show Rules");
            rulesShown = false;
        } else {
            $rules.fadeIn('slow', function() {

            });;
            $(".hideBtn").text("Hide Rules");
            rulesShown = true;
        }
    }



    //start the first game
    generateTarget();
    generateCrysVal();

    //writes all game content to the page
    $currentScore.text(score);
    $wins.text(wins);
    $losses.text(loss);
    $turns.text(turns);


    //animate crystals on hover, 
    $crystal.hover(function() {
        $(this).addClass("hueRotate");
    }, function() {
        $(this).removeClass("hueRotate");
    });

    //click event on the crystals
    $crystal.on("click", function() {

        $(this).css({
            width: '90%'
        });
        $(this).animate({
            width: '100%'
        });

        if (rulesShown && ruleBtnClk == 1) {
            toggleRules();
        }

        gemClick(this);
        turnsUp();


        //check win conditions
        if (score == target) {
            wins++;
            $wins.text(wins);
            $rules.html("<h3>Final Score: " + score + " Target: " + target + "</h3>");
            newGame();
            rulesShown = false;
            toggleRules();
            $rules.append("<h3>You Win! I'm impressed by your mathmatical prowess. <br> Your next target is: </h3><h2> " + target + "</h2>");
            $currentScore.text(score);


            //check failure condition
        } else if (score > target) {
            loss++;
            $losses.text(loss);
            $rules.html("<h3>Final Score: " + score + "       Target: " + target + "</h3>");
            newGame();
            $currentScore.text(score);
            rulesShown = false;
            toggleRules();
            $rules.append("<h3>You went over the target. I recommend not doing that. <br> Your next target is: </h3><h2>" + target + "</h2>");

        };


    })

    //rule button click events
    $ruleBtn.on("click", function() {
        ruleClk++;
        if (ruleClk == 6) {
            ruleClk = 4;
            rulesShown = false;
            toggleRules();
        }
        if (ruleClk == 1) {
            $ruleBtn.text("Really?");
        } else if (ruleClk == 2) {
            $ruleBtn.text("Are you sure you need to hear this?");
        } else if (ruleClk == 3) {
            $ruleBtn.text("It's not that complicated of a game...");
        } else if (ruleClk == 4) {
            $ruleBtn.text("Fine.");
            
            $rules.fadeOut(0, function() {});
            rulesShown = false;
            setTimeout(function(){
                $rules.html("<h3>Reach your target by clicking on the crystals. Each crystal will increase your score. <br> Pay attention though! Each crystal increses your score by a different value and the values change every round. Don't be discouraged if you can't complete this challenge. </h3> <h2>Math is hard.</h2>");
                toggleRules();
            }, 300);    
        } else if (ruleClk == 5) {
            $ruleBtn.text("Need to hear the rules again, huh?")
        }

    })

    //hide button click event
    $hideBtn.on("click", function() {
        toggleRules();
        if (ruleBtnClk == 1) {
            ruleBtnClk = 0;
        } else if (ruleBtnClk == 0) {
            ruleBtnClk = 1;
        }
    })
});
