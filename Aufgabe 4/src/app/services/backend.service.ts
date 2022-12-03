import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Friend } from '../models/Friend';
import { Message } from '../models/Message';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import { ContextService } from './context.service';

/**
 * Service for accessing the REST server backend.
 * See also https://online-lectures-cs.thi.de/chat/full
 */
 @Injectable({
    providedIn: 'root'
})
export class BackendService {
    private baseURL: string = 'https://online-lectures-cs.thi.de/chat/';
    private serverId: string = 'c94d846a-7475-48b8-94e8-eec445d23b3f';
    private restServerURL: string = this.baseURL + this.serverId + '/';
    private headers: any; // header for token

    public constructor(private httpClient: HttpClient, private context: ContextService) { 
    }

    /**
     * Perform authentication on the server based on username and password.
     * Upon successful authentication the username is stored in the context service.
     * @param username 
     * @param password 
     * @returns true if authentication was successful, otherwise false
     */
    public login(username: string, password: string): Observable<boolean> {
        const body = { "username": username, "password": password };
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.post(this.restServerURL + 'login', body);
            serverCall.subscribe({
                next: token => {
                    this.setUser(username, token);
                    subscriber.next(true); // yield result to caller of login()
                },
                error: err => {
                    console.log('login error: ' + err);
                    subscriber.next(false); // yield result to caller of login()
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Register new user for username and password
     * @param username 
     * @param password 
     * @returns true if successfull
     */
    public register(username: string, password: string): Observable<boolean> {
        const body = { "username": username, "password": password };
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.post(this.restServerURL + 'register', body);
            serverCall.subscribe({
                next: token => {
                    this.setUser(username, token);
                    subscriber.next(true); // yield result to caller of register()
                },
                error: err => {
                    console.log('login error: ' + err);
                    subscriber.next(false); // yield result to caller of register()
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Returns true if user with `username` exists.
     * @param username 
     */
    public userExists(username: string): Observable<boolean> {
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.get(this.restServerURL + 'user/' + username);
            serverCall.subscribe({
                next: token => {
                    subscriber.next(true); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(false); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Returns user object for currently logged in user.
     */
    public loadCurrentUser(): Observable<User | null> {
        return this.loadUser(this.context.loggedInUsername);
    }

    /**
     * Returns user object for user with given username.
     * @param username 
     */
    public loadUser(username: string): Observable<User | null> {
        const observable = new Observable<User | null>(subscriber => {
            const serverCall = this.httpClient.get(
                this.restServerURL + 'user/' + username, 
                this.headers);
            serverCall.subscribe({
                next: (buffer: any) => {
                    const user = buffer as User;
                    subscriber.next(user); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(null); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Returns array of friends for current user
     */
    public loadFriends(): Observable<Array<Friend>> {
        const observable = new Observable<Array<Friend>>(subscriber => {
            const serverCall = this.httpClient.get(
                this.restServerURL + 'friend', 
                this.headers);
            serverCall.subscribe({
                next: (buffer: any) => {
                    const friends = buffer as Array<Friend>;
                    subscriber.next(friends); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next([]); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Returns array names of registered users.
     */
    public listUsers(): Observable<Array<string>> {
        const observable = new Observable<Array<string>>(subscriber => {
            const serverCall = this.httpClient.get(
                this.restServerURL + 'user', 
                this.headers);
            serverCall.subscribe({
                next: (buffer: any) => {
                    const users = buffer as Array<string>;
                    subscriber.next(users); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next([]); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Saves given profile on server.
     * @param profile 
     * @returns true if successful
     */
    public saveCurrentUserProfile(profile: Profile): Observable<boolean> {
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.put(this.restServerURL + 'user', profile, this.headers);
            serverCall.subscribe({
                next: (_) => {
                    subscriber.next(true); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(false); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Creates friend request for user `username` on server.
     * @param username 
     * @returns true if successful
     */
    public friendRequest(username: string): Observable<boolean> {
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.post(
                this.restServerURL + 'friend', 
                { "username": username },
                this.headers);
            serverCall.subscribe({
                next: (_) => {
                    subscriber.next(true); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(false); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Accept friend request for user `username`.
     * @param username 
     * @returns true if successful
     */
    public acceptFriendRequest(username: string): Observable<boolean> {
        return this.acceptOrDismissFriendRequest(username, 'accepted');
    }

    /**
     * Deny friend request for user `username`.
     * @param username 
     * @returns true if successful
     */
     public dismissFriendRequest(username: string): Observable<boolean> {
        return this.acceptOrDismissFriendRequest(username, 'dismissed');
    }

   /**
     * Accept or deny friend request for user `username`.
     * @param username 
     * @returns true if successful
     */
    private acceptOrDismissFriendRequest(username: string, status: string): Observable<boolean> {
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.put(
                this.restServerURL + 'friend/' + username,
                { "status": status },
                this.headers);
            serverCall.subscribe({
                next: (_) => {
                    subscriber.next(true); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(false); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Remove user `username` from friend list.
     * @param username 
     * @returns true if successful
     */
    public removeFriend(username: string): Observable<boolean> {
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.delete(
                this.restServerURL + 'friend/' + username, 
                this.headers);
            serverCall.subscribe({
                next: (_) => {
                    subscriber.next(true); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(false); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Return map of unread message counts. 
     * Each entry has a key which is a username and a value which is the unread message count.
     */
    public unreadMessageCounts(): Observable<Map<string, number>> {
        const observable = new Observable<Map<string, number>>(subscriber => {
            const serverCall = this.httpClient.get(
                this.restServerURL + 'unread', 
                this.headers);
            serverCall.subscribe({
                next: (result: any) => {
                    const map = new Map<string, number>();

                    for (let key of Object.keys(result)) {
                        map.set(key, result[key]);
                    }
                    subscriber.next(map); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(new Map<string, number>()); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Return an array of messages between the current user and `otherUser`.
     * @param otherUser 
     */
    public listMessages(otherUser: string): Observable<Array<Message>> {
        const observable = new Observable<Array<Message>>(subscriber => {
            const serverCall = this.httpClient.get(
                this.restServerURL + 'message/' + otherUser, 
                this.headers);
            serverCall.subscribe({
                next: (result: any) => {
                    const messages = result as Array<Message>;
                    subscriber.next(messages); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next([]); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Send message `msg` to user `receiverUsername`.
     * @param receiverUsername 
     * @param msg 
     * @returns true if successful
     */
    public sendMessage(receiverUsername: string, msg: string): Observable<boolean> {
        const body = { "message": msg, "to": receiverUsername };
        const observable = new Observable<boolean>(subscriber => {
            const serverCall = this.httpClient.post(this.restServerURL + 'message', body, this.headers);
            serverCall.subscribe({
                next: token => {
                    subscriber.next(true); // yield result to caller 
                },
                error: err => {
                    console.log('backend service error: ' + err);
                    subscriber.next(false); // yield result to caller
                }
            });
        }); 
        
        return observable;
    }

    /**
     * Store username and token (from login call) for further reference.
     * The token is embedded in a http header value.
     * @param username name of logged in user
     * @param token security token for subsequent calls
     */
    private setUser(username: string, token: any): void {
        this.context.loggedInUsername = username;
        const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token.token);
        this.headers = { 'headers': headers };
        console.log(`user ${username} - token: ${JSON.stringify(token)}`);
    }
}
