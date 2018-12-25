
let randomWord; /// need to keep this to put in request url for hint
let urlState = 0; /// for diffrent state getData doing somthing diffrent
let lifesWaste = 0; /// counter for lifes wasted
let letterArray = new Array;  /// array for keeping letters from splitted random word
let hintState = 0; /// variable for hint state to return if hint was already open or not, to prevent requesting same data over again when pressing button and overwrritting hint div

/////////////////////////////// get data from Wordnik api, url variables getting random Word or definition for that word
function getData(){
    $.ajax({
        dataType: "json",
        url: url,
        data: 'GET'
    })
    .done(function(data){
        if(urlState == 0){ /////// transfer data to function which making DOM for random word
            addWord(data.word);
        } else { /////// display div for hint and fill it with data
            $(".hint").text('Hint: ' + data[0].text) 
            $(".hint").css({"display":"block"})

            for(let i=lifesWaste+1; i < lifesWaste + 5; i++){  //// visually update lifes and hangman
                $('.hangman #hg'+i).css({"display":"block"})
                $('.lifes .heart:nth-child('+ i +')').css({"display":"none"})
            }
            lifesWaste+=4;
            gameState();
        }
    })
    .fail(function(xhr){
        console.log('error', xhr);
    })
}

/////////////////////////////// make DOM for random word, split word to letters into array
function addWord(data){
    randomWord = data;
    let word = data;
    letterArray = word.split('');
    for(let i=0; i < letterArray.length; i++){
        $(".word").append('<div class="letter" id="'+ letterArray[i] +'"></div>')
    }
}

/////////////////////////////// Detect keyboard and set value as string into variable 'value'
window.addEventListener('keypress', function (e) {
    if(($('.gamestate').css('display') == 'none') && randomWord) {
        let value = String.fromCharCode(e.which);

        ///////   prevent to display value which was used before   //////check value all div with class if already was pressed/used, if not set true, if was used break each function and set false to variable
        let checkUsedLetters = true;
        $('.usedletter').each(function() {
            if( $(this).text() !== value ){
                checkUsedLetters = true;
            }
            else { 
                checkUsedLetters = false;
                return false;
            }
        });

        if (checkUsedLetters) {  ///// do it if value wasn't used previously
            $(".usedletters").append('<div class="usedletter">'+ value +'</div>')
            checkLetter(value);
        }        
    }
}, false);

/////////////////////////////// Check if random word (letters in array) containt your pressed letter value
function checkLetter(value){
    if (letterArray.includes(value)) {  
    $('.letter#'+value).text(value)
    gameState();
    } else {
        lifesWaste++;
        $('.hangman #hg'+lifesWaste).css({"display":"block"})
        $('.lifes .heart:nth-child('+ lifesWaste +')').css({"display":"none"})
        gameState();
    }
}

/////////////////////////////// Check if you wasted more than 9 lifes, or all letters from random words you guessed/are displayed
function gameState(){
    if(lifesWaste >= 9){
        $('.gamestate').html('You Lost! <br> <p>searching word: ' + randomWord + '</p>')
        $('.gamestate').css({"display":"block"})
    } else if ($(".letter:empty").length == 0 ) {
        $('.gamestate').text('You Won!')
        $('.gamestate').css({"display":"block"})
    }
}
/////////////////////////////// on click button hint, checks if gamestate are open, random word exist(is took from data) and if hint already is open, then request for data (hint)
$('#getHint').on("click", function(){

    if(($('.gamestate').css('display') == 'none') && randomWord && hintState == 0){
        url = "https://api.wordnik.com/v4/word.json/"+ randomWord +"/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=82cb40ed55fb0e7abe00509d3dd0f38baa90416783e9aafbb";
        urlState = 1;
        hintState = 1;

        getData();
    }
})

/////////////////////////////// on click button new word,  resetting/clearing/hides games components and request for random word
$('#getWord').on("click", function(){

    $(".hint").css({"display":"none"})
    lifesWaste=0;
    hintState = 0;
    $('.lifes .heart').css({"display":"inline-block"});
    $('.hangman').children().css({"display":"none"});
    $('.word').html('');
    $('.usedletters').html('Your letters:');
    $('.gamestate').css({"display":"none"});

    url = "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=82cb40ed55fb0e7abe00509d3dd0f38baa90416783e9aafbb";
    urlState = 0;
    getData();
   
})