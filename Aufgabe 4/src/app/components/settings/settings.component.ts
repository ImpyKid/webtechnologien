import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    public username: String;

    public constructor(private backendService: BackendService, private router: Router, private contextService: ContextService) {
    }

    public ngOnInit(): void {
        this.backendService.loadCurrentUser()
            .subscribe((user: User | null) => {
                if (user != null) {
                    const userJIADW = JSON.parse(JSON.stringify(user)); // User just in a dumb way
                    
                    const loadedProfile = new Profile(userJIADW.firstName, userJIADW.lastName, userJIADW.coffeeOrTea, userJIADW.description, userJIADW.layout);

                    this.profile = loadedProfile;
                }
            })
        
        this.username = this.contextService.loggedInUsername;
    }

    public sendData(): void {
        this.backendService.saveCurrentUserProfile(this.profile)
            .subscribe((ok: Boolean) => {
                if (ok) {
                    console.log("Transfer successfull.");
                    this.router.navigate(['/friends']);
                } else {
                    alert("Data transfer failed!");
                }
            })
    }

    private isNullOrWhitespace(string: String): boolean {
        if (string == null || string.trim() === '') return true;
        return false;
    }
}
