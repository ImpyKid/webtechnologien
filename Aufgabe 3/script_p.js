/*******************************

    JS-Datei Pascal Spangler

*******************************/

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let data = JSON.parse(xmlhttp.responseText);
        console.log(data);
    }
};
// Chat Server URL und Collection ID als Teil der URL
xmlhttp.open("GET", window.chatServer + "/" + window.chatCollectionId +
    "/user", true);
// Das Token zur Authentifizierung, wenn notwendig
xmlhttp.setRequestHeader('Authorization', 'Bearer ' + window.chatToken);
xmlhttp.send();


function validateRegister() {
    let namecheck, pwlencheck, pwconfirmcheck, usrexist = false;
    const name = document.forms["registerForm"]["fname"].value;
    const password = document.forms["registerForm"]["fpwd"].value;
    const passwordcheck = document.forms["registerForm"]["fpwd-confirm"].value;

    if (name.length < 3) {
        alert("Der Nutzername soll mindestens drei Zeichen beinhalten. ");
        return false;
    } else namecheck = true;

    if (password.length < 8) {
        alert("Das Passwort soll mindestens acht Zeichen beinhalten. ");
        return false;
    } else pwlencheck = true;

    if (password !== passwordcheck) {
        alert("Das Passwort muss gleich sein. ");
        return false;
    } else pwconfirmcheck = true;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 204) {
                alert("Der angegebene Nutzer existiert schon!");
                return false;
            } else if (xmlhttp.status == 404) { usrexist = true; 
              
                if (namecheck && pwlencheck && pwconfirmcheck && usrexist) {
                    document.getElementById("registerForm").submit();
                    return true;
                }
            
            }
        }
    };
    xmlhttp.open("GET", window.chatServer + "/" + window.chatCollectionId + "/user/" + name, true);
    xmlhttp.send();

    return false;
}

function changeBorder(input) {
    switch (input.id) {
        case "fname":
            input.addEventListener("input", function () {
                if (input.value.length < 3) {
                    input.classList.add("border-red");
                    input.classList.remove("border-green");
                    //input.style.border = '2px solid red';
                }
                else {

                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            if (xmlhttp.status == 204) {
                                input.classList.add("border-red");
                                input.classList.remove("border-green");
                                //input.style.border = '2px solid red';
                            } else if (xmlhttp.status == 404) {
                                input.classList.add("border-green");
                                input.classList.remove("border-red");
                                //input.style.border = '2px solid green';
                            }
                        }
                    };
                    xmlhttp.open("GET", window.chatServer + "/" + window.chatCollectionId + "/user/" + input.value, true);
                    xmlhttp.send();

                }
            })
            break;

        case "fpwd":
            input.addEventListener("input", function () {
                if (input.value.length < 8) {
                    input.classList.add("border-red");
                    input.classList.remove("border-green");
                    //input.style.border = '2px solid red';
                }
                else {
                    input.classList.add("border-green");
                    input.classList.remove("border-red");
                    //input.style.border = '2px solid green';
                }
            })
            break;
        //Die Passwort-Wiederholung muss dem Passwort entsprechen
        //Das Passwort muss min. 8 Zeichen haben
        case "fpwd-confirm":
            input.addEventListener("input", function () {
                if (input.value === document.getElementById("fpwd").value) {
                    input.classList.add("border-green");
                    input.classList.remove("border-red");
                    //input.style.border = '2px solid green';
                }
                else {
                    //input.style.border = '2px solid red';
                    input.classList.add("border-red");
                    input.classList.remove("border-green");
                }
            })
            break;

        default:
            break;
    }

}

//Der gewählte Nutzername darf noch nicht verwendet worden sein, nutzen Sie hierfür
//aus den Dummy-Datensatz und Informationen die Server-Funktion User Exists