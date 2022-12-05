import { Component, OnDestroy, OnInit } from '@angular/core';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';
import { IntervalService } from 'src/app/services/interval.service';
import * as moment from 'moment';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
    // DIV für Nachrichten (s. Template) als Kind-Element für Aufrufe (s. scrollToBottom()) nutzen
    @ViewChild('chatbox') private myScrollContainer: ElementRef;

    public chattingWithUsername: string = "";
    public preferedChatLayout: number;

    public messages: Array<Message> = [];

    public inputMessage: string;

    public constructor(private contextService: ContextService, private backendService: BackendService, 
        private intervalService: IntervalService, private router: Router) { 
        this.myScrollContainer = new ElementRef(null);
    }
    
    public ngOnDestroy(): void {
        this.intervalService.clearIntervals();
    }

    public ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    /**
     * Setzt in der Nachrichtenliste die Scrollposition ("scrollTop") auf die DIV-Größe ("scrollHeight"). Dies bewirkt ein 
     * Scrollen ans Ende.
     */
    private scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { 
        }                 
    }

    public ngOnInit(): void {
        this.scrollToBottom();
        
        this.chattingWithUsername = this.contextService.currentChatUsername;

        this.backendService.loadCurrentUser()
            .subscribe((user: User | null) => {
                if(user != null) {
                    this.preferedChatLayout = JSON.parse(JSON.stringify(user)).layout;

                    if (this.preferedChatLayout === undefined) {
                        this.preferedChatLayout = 1; 
                            //Setzt Standard-Layout auf einzeilig, falls Nutzer noch nicht ausgewählt hat.
                    }
                }
            });
        
        this.intervalService.setInterval("chat", () => this.getMessages());
    }

    private getMessages(): void {
        this.backendService.listMessages(this.chattingWithUsername)
            .subscribe((messageArray: Array<Message>) => {
                this.messages = messageArray;
            });
    }

    public sendMessage(): void {
        this.backendService.sendMessage(this.chattingWithUsername, this.inputMessage)
            .subscribe((ok: Boolean) => {
                if (ok) {
                    this.inputMessage = "";
                    this.getMessages();
                    this.scrollToBottom();
                }
            })
    }

    public deleteFriend(): void {
        if(confirm("Do you really want to remove " + this.contextService.currentChatUsername + " as friend?")) {
            this.backendService.removeFriend(this.contextService.currentChatUsername)
                .subscribe((ok: boolean) => {
                    if (ok) {
                        this.router.navigate(['/friends']);
                    }
                })
        }
    }

    public convertToTimeString(time: number): string {
        let momentTime = moment(time);
        return momentTime.format("D.M.YYYY HH:mm:ss");
    }
}
