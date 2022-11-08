/*******************************

    JS-Datei Matthias Roy

*******************************/

function getUsers() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            if (data.length > 0) {
                var input = document.getElementById("input-friends");

                input.addEventListener("input", function (e) {
                    var list, item, value = this.value; //this.value = Inhalt von Textbox (in diesem Kontext)

                    clearSuggestList();

                    list = document.createElement("div");
                    list.setAttribute("id", "sug-friends-items");
                    list.setAttribute("class", "sug-friends-items");
                    this.parentNode.appendChild(list); //Fügt das DIV dem DIV über Input hinzu.

                    data.forEach(element => {
                        if (element.substr(0, value.length).toUpperCase() == value.toUpperCase()) {
                            item = document.createElement("div");
                            item.innerHTML = "<strong>" + element.substr(0, value.length) + "</strong>";
                            item.innerHTML += element.substr(value.length);
                            item.innerHTML += "<input type='hidden' value='" + element + "'>";

                            item.addEventListener("click", function (e) {
                                input.value = this.getElementsByTagName("input")[0].value;
                                clearSuggestList();
                            });
                            list.appendChild(item);
                        }
                    });
                });
            } else {
                console.error("Array contains nothing!");
                return null;
            }
        }
    };

    xmlhttp.open("GET", window.chatServer + "/" + window.chatCollectionId + "/user", true);
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + window.chatToken);
    xmlhttp.send();
}

function clearSuggestList(input) {
    var elements = document.getElementsByClassName("sug-friends-items");
    for (var i = 0; i < elements.length; i++) {
        if (input != elements[i] && input != document.getElementById("input-friends")) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }
}

function checkUserExist() {
    var value = document.getElementById("input-friends").value;
    var submitForm = document.getElementById("submitFormAddFriend");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 204) {
                console.log("Existiert");
                submitForm.submit();
                return true;
            } else if (xmlhttp.status == 404) {
                console.log("Existiert nicht");
                return false;
            }
        }
    };
    xmlhttp.open("GET", window.chatServer + "/" + window.chatCollectionId + "/user/" + value);
    xmlhttp.send();
}

document.addEventListener("click", function (e) {
    clearSuggestList(e.target);
});