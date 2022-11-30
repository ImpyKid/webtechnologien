import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/Profile';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    public drink: String;
    public profile: Profile = new Profile("", "", "", "", "");
    public currentUser: User;

    public constructor(private backendService: BackendService, private contextService: ContextService) {
    }

    public ngOnInit(): void {
        this.backendService.login("Tom", "12345678")  //Temporär, bis Login implementiert wird.
            .subscribe((ok: boolean) => {
                if (ok) {
                    console.log("Login erfolgreich");
                } else {
                    alert("Login fehlgeschlagen!");
                }
        });

        this.backendService.loadCurrentUser()
            .subscribe((user: User | null) => {
                if (user != null) {
                    this.profile.firstName = this.contextService.loggedInUsername;
                    console.log(this.profile);
                }
            })
    }

    public printData(): void {
        console.log(this.contextService, this.profile);
    }

    public sendData(): void {
        this.backendService.saveCurrentUserProfile(this.profile)
            .subscribe((ok: Boolean) => {
                if (ok) {
                    console.log("Transfer successfull.");
                } else {
                    alert("Data transfer failed!");
                }
            })
    }
}
