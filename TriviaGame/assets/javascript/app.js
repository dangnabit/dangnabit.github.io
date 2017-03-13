$(document).ready(function() {
    var $instructions = $('#instructions');
    var $question = $('#question');
    var $selections = $('#selections');
    var $time = $('#time');
    var $categorySelect = $('#trivia_category');
    var $difficultySelect = $('#trivia_difficulty');
    var $startBtn = $('#gameStart');
    var $timer = $('.timer');


    var category = '';
    var difficulty = '';

    var gameTimer;
    var queryURL;

    var score = 0;
    var missedAnswers = 0;

    var triviaGame = {

        time: 45,
        questionNumber: 0,
        questions: [],

        // Game timer, checks end game conditions.
        timeDown: function() {
            triviaGame.time--;
            $time.text(triviaGame.time);
            if (triviaGame.time <= 0) {
                triviaGame.endGame();
            }
        },

        // Builds display array.
        displayQuestion: function(questionIndex) {
            var fullSelectionList = [];
            var correct_answerPushed = false;
            var i = 0;
            var rand;

            // builds random selection list
            while (fullSelectionList.length < 4 || i < 3) {
                rand = Math.round(Math.random() * 3);

                if (rand == 1 && !correct_answerPushed) {
                    fullSelectionList.push(questionIndex.correct_answer);
                    correct_answerPushed = true;
                } else if (i == 3 && !correct_answerPushed) {
                    fullSelectionList.push(questionIndex.correct_answer);
                    correct_answerPushed = true;
                } else if (i < 3) {
                    fullSelectionList.push(questionIndex.incorrect_answers[i]);
                    i++;
                }

            }

            $.each(fullSelectionList, function(i) {
                var $button = $('<div>');
                var $br = $('<br>');
                $button.addClass('btn btn-lg btn-primary col-sm-12 triviaBtn');
                $button.attr('data-answer', fullSelectionList[i]);
                $button.text(fullSelectionList[i]);
                $selections.append($button);
            });

            $selections.fadeTo('slow', 1);
            $question.html(questionIndex.question).fadeTo('slow', 1);

        },


        selectionClick: function(button) {
            $question.fadeTo('slow', 0);
            $selections.fadeTo('0', 0);
            // console.log(this.dataset.answer);
            if (this.dataset.answer === triviaGame.questions[triviaGame.questionNumber].correct_answer) {
                $(this).addClass('btn-success');
                triviaGame.questionNumber++;
                score++;
            } else {
                $(this).addClass('btn-danger');
                $('.triviaBtn').each(function() {
                    if (this.dataset.answer === triviaGame.questions[triviaGame.questionNumber].correct_answer) {
                        $(this).addClass('btn-success');
                    }
                });
                triviaGame.questionNumber++;
                missedAnswers++;
            }

            if (triviaGame.questionNumber < triviaGame.questions.length) {
                setTimeout(function() {
                    triviaGame.gameGo();
                }, 500);

            } else {
                setTimeout(function() {
                    triviaGame.endGame();
                }, 500);
            }
        },

        gameGo: function() {
            clearGame();
            this.displayQuestion(this.questions[this.questionNumber]);
        },

        endGame: function() {
            var unanswered = 10 - triviaGame.questionNumber;

            clearInterval(gameTimer);
            $question.empty();
            $selections.empty();

            setTimeout(function() {
                $question.append("Score: " + score).fadeTo('slow', 1);
            }, 750);

            setTimeout(function() {
                $selections.html("<p class='text-center'>Incorrect Answers: " + missedAnswers + "</p><p class='text-center'>Unanswered Questions: " + unanswered + "</p>").fadeTo('slow', 1);
            }, 1000);
        }


    };

    function clearGame() {
        $selections.empty();
        $question.empty();
    }

    function urlCreator() {
        if ($categorySelect.val() === 'any') {
            category = '';
        } else {
            category = '&category=' + $categorySelect.val();
        }

        if ($difficultySelect.val() === 'any') {
            difficulty = '';
        } else {
            difficulty = '&difficulty=' + $difficultySelect.val();
        }

        queryURL = 'https://opentdb.com/api.php?amount=10&type=multiple' + category + difficulty;

    }

    function gameSetup() {
        triviaGame.questions = [];
        triviaGame.questionNumber = 0;
        triviaGame.time = 45;
        score = 0;
        missedAnswers = 0;

        $question.fadeTo('0', 0);
        $selections.fadeTo('0', 0);


        $time.text('45');
        clearInterval(gameTimer);


        urlCreator();

        clearGame();


        console.log(queryURL);

        $.ajax({
            url: queryURL,
            type: 'GET'
        }).done(function(response) {
            triviaGame.questions = response.results;
            console.log(triviaGame.questions);

            if (triviaGame.questions.length === 0) {
                setTimeout(function() {
                    $question.text("Failed to fetch Trivia Questions in the category or difficulty. Please change your selections and press Start again.").fadeTo('slow', 1);
                }, 500);
            } else {

                setTimeout(function() {
                    gameTimer = setInterval(triviaGame.timeDown, 1000);
                    triviaGame.gameGo();
                }, 500);
            }
        });
    }

    $startBtn.on('click', function() {
        gameSetup();
    });

    $(document).on('click', '.triviaBtn', triviaGame.selectionClick);

});
