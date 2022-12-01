import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public username: string;
    public password: string;

    public constructor(private backendService: BackendService, private router: Router) { 
    }

    public ngOnInit(): void {
    }

    public sendLogin(): void {
        this.backendService.login(this.username, this.password)
            .subscribe((ok: boolean) => {
                if (ok) {
                    this.router.navigate(['/friends']);
                } else {
                    alert("Login fehlgeschlagen!");
                }
            })
    }

}
