import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Friend } from 'src/app/models/Friend';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    public friends: Array<Friend> = [];
    public requestedFriends: Array<Friend> = [];
    public users: Array<String>;

    public currentUsername: String = "";

    public friendInput: String = "";

    public constructor(private backendService: BackendService, private contextService: ContextService) {
    }

    public ngOnInit(): void {
        this.backendService.loadCurrentUser()
            .subscribe((currentUser: User | null) => {
                if (currentUser != null){
                    this.currentUsername = currentUser.username;
                }
            });

        this.backendService.loadFriends()
            .subscribe((list: Friend[]) => {
                if (list.length) {
                    this.friends = list;
                } else {
                    this.friends = [];
                }
            });
        
        this.friends.forEach(element => {
            if (element.status === "requested") this.requestedFriends.push(element);
        });
        
    }

    public loadUsers() {
        this.backendService.listUsers()
            .subscribe((userList: Array<String>) => {
                if (userList.length) {
                    this.users = userList;

                    const input = <HTMLInputElement>document.getElementById("input-friends");

                    //input.addEventListener("input", this.displayFriendsSuggestion(input), false);
                } else {
                    console.log("No users found.");
                }
            });
    }

    public clearSuggestList(input: any) {
        var elements = document.getElementsByClassName("sug-friends-items");
        for (var i = 0; i < elements.length; i++) {
            if (input != elements[i] && input != document.getElementById("input-friends")) {
                elements[i].parentNode?.removeChild(elements[i]);
            }
        }
    }

    public displayFriendsSuggestion(_value: HTMLInputElement) {
        let list: HTMLDivElement, item, value = _value.value;

                        this.clearSuggestList(_value);

                        list = document.createElement("div");
                        list.setAttribute("id", "sug-friends-items");
                        list.setAttribute("class", "sug-friends-items");
                        _value.parentNode?.appendChild(list);

                        this.users.forEach(element => {
                            if (element.substring(0, value.length).toUpperCase() == value.toUpperCase()) {
                                item = document.createElement("div");
                                item.innerHTML = "<strong>" + element.substring(0, value.length) + "</strong>";
                                item.innerHTML += element.substring(value.length);
                                item.innerHTML += "<input type='hidden' value='" + element + "'>";

                                //item.addEventListener("click", this.selectedFriendToInput(_value, item), false);
                                list.appendChild(item);
                            }
                        })
    }

    public selectedFriendToInput(_value: HTMLInputElement, item: HTMLDivElement) {
        _value.value = item.getElementsByTagName("input")[0].value;
        this.clearSuggestList(_value);
    }
}
