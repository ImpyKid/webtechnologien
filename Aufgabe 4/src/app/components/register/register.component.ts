import { Component, OnInit, ɵsetAllowDuplicateNgModuleIdsForTest } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public password:string;
    public confirmPassword:string;
    public username:string;
    public userexist:boolean;

    public registerForm: FormGroup = new FormGroup({
        username: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ], []),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ], []),
        confirmpwd: new FormControl('', [
            Validators.required,   
        ], []),
    })



    public constructor(private backendService: BackendService, private router: Router ) { 
    }

    public ngOnInit(): void {

    }

    public checkpwd(): boolean{
        if (this.password === this.confirmPassword){return true;}else
        return false;
    }
    
    public usercheck(): void{
        this.userexist = false;
        this.backendService.userExists(this.username).subscribe((ok: boolean) => {
            if (ok) {
                this.userexist = true;
            } 
        })
       
            
        
    }

    public createuser(): void{
       this.backendService.register(this.username, this.password).subscribe((ok: boolean) => {
        if (ok) {
            this.router.navigate(['/friends']);
        }else{console.error("Failed to register user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")}
       })
    }



}