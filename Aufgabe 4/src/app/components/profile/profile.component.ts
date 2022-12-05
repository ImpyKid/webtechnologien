import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/Profile';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';
import { ContextService } from 'src/app/services/context.service';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    public chatPartnerProfile: Profile = new Profile("", "", "", "", "");
    public noData: boolean = false;

    public chatPartner: string;

    public constructor(private contextService: ContextService, private backendService: BackendService,
        private router: Router) { 
    }

    public ngOnInit(): void {
        this.chatPartner = this.contextService.currentChatUsername;

        this.getProfile();
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

    public getProfile(): void {
        this.backendService.loadUser(this.chatPartner)
            .subscribe((user: User | null) => {
                if (user != null) {
                    const userJIADW = JSON.parse(JSON.stringify(user)); // User just in a dumb way
                    
                    const loadedProfile = new Profile(userJIADW.firstName, userJIADW.lastName, userJIADW.coffeeOrTea, userJIADW.description, userJIADW.layout);
                    
                    this.chatPartnerProfile.description = loadedProfile.description != (null && undefined) ? loadedProfile.description : "";
                    this.chatPartnerProfile.firstName = loadedProfile.firstName != (null && undefined) ? loadedProfile.firstName : "";
                    this.chatPartnerProfile.lastName = loadedProfile.lastName != (null && undefined) ? loadedProfile.lastName : "";
                    this.chatPartnerProfile.coffeeOrTea = this.coffeeOrTeaConvert(loadedProfile.coffeeOrTea);

                    if (this.chatPartnerProfile.description == "" && this.chatPartnerProfile.firstName == "" &&
                        this.chatPartnerProfile.lastName == "" && this.chatPartnerProfile.coffeeOrTea == "")
                        this.noData = true;
                }
            });
    }

    public coffeeOrTeaConvert(rawData: string): string {
        let result: string = "";

        switch (rawData) {
            case "1":
                result = "Neither nor";
                break;
            case "2":
                result = "Coffee";
                break;
            case "3":
                result = "Tea";
                break;
            default:
                result = "";
                break;
        }

        return result;
    }
}
