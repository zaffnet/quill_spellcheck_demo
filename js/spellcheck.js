/*jshint esversion: 6 */

// import FuzzySet from './fuzzyset';
// import words from './words';

var lexicon = new Set(words);

const fs = FuzzySet(words, true);


const begin_chars = "-~*[(";
const end_chars = "?.,:!)]*~-";

const special_symbols = new Set([
    "<foreign>", "<laughter>", "<spk-noise>", "<non-speech>", "<int>",
    "<overlap>", "<silence>", "<name>", "</name>", "<recorded>",
    "</recorded>", "<sta>", "</sta>", "<speaker2>", "</speaker2>",
    "<speaker3>", "</speaker3>", "((---))"
]);


/*
    Split each token into three parts: (begin_chars, word, end_chars)
    here?           =>      "", "here", "?"
    ~[Uber]         =>      "~[", "Uber", "]"
    Reese],         =>      "", "Reese", "],"

*/
function splitToken(token) {
    'use strict';
    let start = '', word, end = '', i = 0;
    for (; i < token.length; i++) {
        if (begin_chars.indexOf(token[i]) > -1) {
            start += token[i];
        } else {
            break;
        }
    }
    token = token.substr(i);
    i = token.length;
    while (i--) {
        if (end_chars.indexOf(token[i]) > -1) {
            end = token[i] + end;
        } else {
            break;
        }
    }
    word = token.substr(0, i + 1);
    return [start, word, end];
}


function isOOV(word) {
    'use strict';
    // var [start, word, end] = splitToken(token);
    return !(word === '' || lexicon.has(word.toLowerCase()) || special_symbols.has(word));
}


/*
TODO: This should consider case_sensitive=False
E.g.,
    getSuggestions("whre?") = ["where?", "here?"]
*/
function getSuggestions(token) {
    'use strict';
    var [start, word, end] = splitToken(token);

    if (!isOOV(word)) {
        return [];
    }

    let suggestions = [];
    let fuzzyMatches = fs.get(word);
    if (fuzzyMatches) {
        for (let suggest of fuzzyMatches.slice(0, 4)) {
            suggestions.push(start + suggest[1] + end);
        }
    }

    return suggestions;
}
