// ==UserScript==
// @name         Conjuguemos Answer Bot - French
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Answers French verb assignments automatically on conjuguemos.
// @author       GSRHackZ
// @match        https://conjuguemos.com/*
// @icon         https://www.shareicon.net/data/2015/09/25/107090_flag_512x512.png
// @grant        none
// ==/UserScript==

function start(){
    if(document.getElementById("verb-input").innerText.trim().length>0){
        autoAnswer();
        return true;
    }
}
smartExec(start,100);
let tenses = ["negative","positive"];
function autoAnswer(){
    let wip = false;
    setInterval(()=>{
        if(!wip){
            wip=true;
            let verb = document.getElementById("verb-input").innerText,
                pronoun = document.getElementById("pronoun-input").innerText,
                getHints = document.getElementById("verb_help_features"),
                pronounLen = pronoun.split(" ").length,
                input, id = pronoun+verb+pronounLen;
            if(location.href.includes("https://conjuguemos.com/verb/homework/")){
                input = document.getElementById("answer-input");
            }
            else if(location.href.includes("https://conjuguemos.com/assignment/")){
                input = document.getElementById("assignment-answer-input");
            }
            getHints.click();
            let wait = setInterval(()=>{
                if(document.getElementsByClassName("x-modal-content hint-modal")[0]!==undefined){
                    let hints = document.getElementById("verb-hint").children[3].children,
                        close = document.getElementsByClassName("icon x-icon fs-18")[1].parentElement,
                        submit = document.getElementsByClassName("js-check-button")[0],
                        tense = document.getElementById("tense-input").innerText,
                        state = document.getElementsByClassName("js-bubble")[0],
                        pronouns = [],verbs=[],answer=false,special=false;
                    for(let i=0;i<hints.length;i++){
                        if(hints[i].children.length>0){
                            let all = arrTrim(hints[i].outerText.split("\n"),0);
                            if(all[0].includes("/")){
                                special = true;
                                pronouns.push(all[0].split("/").map(s => s.trim()).join("/"))
                            }
                            else{
                                pronouns.push(all[0]);
                            }
                            verbs.push(all[1]);
                        }
                    }
                    console.log(verbs,pronouns,pronounLen)
                    if(!tenses.includes(tense)){
                        for(let i=0;i<pronouns.length;i++){
                            if(pronouns[i].includes(pronoun)){
                                answer = verbs[i];
                            }
                        }
                    }
                    if(answer==false){
                        if(!tenses.includes(tense)){
                            let prediction = identify(pronoun,pronounLen,special);
                            for(let i=0;i<pronouns.length;i++){
                                if(pronouns[i].includes(prediction)){
                                    answer = verbs[i];
                                }
                            }
                        }
                        else{
                            if(tense=="positive"){
                                answer = verbs[0]
                            }
                            else if(tense=="negative"){
                                answer = verbs[verbs.length-1]
                            }
                        }
                        console.log(answer);
                    }
                    if(answer!==false){
                        close.click();
                        input.value=answer;
                        setTimeout(()=>{
                            submit.classList.remove("disabled");
                            submit.click();
                        },350)
                        setTimeout(()=>{
                            if(state.classList[2]!=="incorrect"){
                                wip = false;
                            }
                        },1000)
                        clearInterval(wait)
                    }
                }
            },200)
            }
    },10)
}

function identify(pronoun,len,special){
    if(len==3){
        if(pronoun.includes(" et ")&&pronoun.includes("moi")){
            return "nous";
        }
        if(pronoun.includes(" et ")&&!pronoun.includes("moi")){
            return "ils/";
        }
        if(pronoun.includes("je")||pronoun.includes("j'")){
            return "j"
        }
    }
    else{
        if(special){
            return "il/";
        }
        else{
            return "il";
        }
    }
}

function arrTrim(arr,len,clean){
    let temp = [];
    for(let i=0;i<arr.length;i++){
        if(arr[i].length>len){
            temp.push(arr[i]);
        }
    }
    return temp;
}

function smartExec(func,wait){
    let exec = setInterval(()=>{
        if(func()){
            clearInterval(exec)
        }
    },wait)}
