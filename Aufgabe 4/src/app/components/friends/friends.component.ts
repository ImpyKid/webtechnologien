import { Component, ComponentFactoryResolver, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Friend } from 'src/app/models/Friend';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';
import { IntervalService } from 'src/app/services/interval.service';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {

    public friends: Array<Friend> = [];
    public friendList: Array<Friend> = [];
    public requestedFriends: Array<Friend> = [];
    public users: Array<string>;

    public currentUsername: string = "";

    public friendInput: string = "";
    public message: string = "";
    public displayErrorMessage: boolean = false;

    public constructor(private backendService: BackendService, private intervalService: IntervalService,
        private contextService: ContextService, private router: Router) {
    }

    public ngOnDestroy(): void {
        this.intervalService.clearIntervals();
    }

    public ngOnInit(): void {
        this.contextService.currentChatUsername = "";

        this.backendService.loadCurrentUser()
            .subscribe((currentUser: User | null) => {
                if (currentUser != null) {
                    this.currentUsername = currentUser.username;
                }
            });
        
        this.loadUsers();

        this.intervalService.setInterval("friends", () => this.friendIntervalService());
    }

    public loadUsers() {
        this.backendService.listUsers()
            .subscribe((userList: Array<string>) => {
                if (userList.length) {
                    this.users = userList;
                } else {
                    console.log("No users found.");
                }
            });
    }

    public sendFriendRequest(): void {
        let exists: Boolean = false;

        if (this.friendList.some((friend) => friend.username.toUpperCase() == this.friendInput.toUpperCase())) {
            this.showErrorMessage("Already in friends list");
        } else if (this.friendInput.toUpperCase() == this.contextService.loggedInUsername.toUpperCase()) {
            this.showErrorMessage("You can't send a friend request to yourself.");
        } else {
            this.users.forEach(element => {
                if (this.friendInput == element) {
                    exists = true;
                }
            });

            if (exists) {
                this.backendService.friendRequest(this.friendInput)
                    .subscribe((ok: boolean) => {
                        if (ok) {
                            console.log("Friend requested")
                        } else {
                            console.log("");
                        }
                    })
            } else {
                this.showErrorMessage("User doesn't exist.");
            }
        }
    }

    public acceptRequest(index: number) {
        this.backendService.acceptFriendRequest(this.requestedFriends[index].username)
            .subscribe((ok: Boolean) => {
                if (ok) {
                    this.requestedFriends.splice(index, 1);
                } else {
                    console.error("");
                }
            });
    }

    public declineRequest(index: number) {
        this.backendService.dismissFriendRequest(this.requestedFriends[index].username)
            .subscribe((ok: Boolean) => {
                if (ok) {
                    this.requestedFriends.splice(index, 1);
                } else {
                    console.error("");
                }
            });
    }

    private friendIntervalService(): void {
        this.loadFriends();
        this.backendService.unreadMessageCounts()
            .subscribe((map: Map<string, number>) => {
                if (map.size != 0) {
                    map.forEach((counter, username) => {
                        this.friendList.forEach(friends => {
                            if (username == friends.username) {
                                friends.unreadMessages = counter;
                            }
                        });
                    });
                }
            });
    }

    public loadFriends(): void {
        this.backendService.loadFriends()
            .subscribe((list: Array<Friend>) => {
                if (list.length) {
                    this.friends = list;
                    for (let i = 0; i < this.friends.length; i++) {
                        this.friends[i].unreadMessages = 0;
                        if (this.friends[i].status == "requested") {
                            if (!this.requestedFriends.some(friend => friend.username == this.friends[i].username)) {
                                this.requestedFriends.push(this.friends[i]);
                            }
                        }
                        if (this.friends[i].status == "accepted") {
                            if (!this.friendList.some(friend => friend.username == this.friends[i].username)) {
                                this.friendList.push(this.friends[i]);
                            }
                        }
                    }
                } else {
                    this.friends = [];
                }
            });
    }

    public enterChat(index: number) {
        this.contextService.currentChatUsername = this.friendList[index].username;
        this.router.navigate(['/chat']);
    }

    private showErrorMessage(message: string) {
        this.message = message;
        this.displayErrorMessage = true;

        setTimeout(() => {
            this.displayErrorMessage = false;
            this.message = "";
        }, 5000);
    }

    public filterUsers(): Array<string> {
        if (this.users.length != 0 && this.users != (undefined || null)) return this.users.filter(user => 
            user.substring(0, this.friendInput.length).toUpperCase() == this.friendInput.toUpperCase());
        else return [];
    }
}

