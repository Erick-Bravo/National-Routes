window.addEventListener("DOMContentLoaded", () => {


// Sign-Up
    const signUpForm = document.querySelector("#sign-up-form")
    signUpForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        let username = document.querySelector("#sign-up-form input[name='username']").value; // CSS selectors (space = a descendant)
        let email = document.querySelector("#sign-up-form input[name='email']").value;
        let password = document.querySelector("#sign-up-form input[name='password']").value;
        let confirmPassword = document.querySelector("#sign-up-form input[name='confirmPassword']").value;
        let _csrf = document.querySelector("#sign-up-form input[name='_csrf']").value;

        let result = await fetch("/sign-up", {
            init: {credentials: "same-origin"},
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, confirmPassword, _csrf })
         })

        result = await result.json();

        if(!result.errors) {
            location.href = "/routes";
            return;
        } else {
            const errorDiv = document.querySelector("#sign-up-form div.errors");
            errorDiv.innerHTML = "";
            result.errors.forEach(error => {
                const div = document.createElement("div");
                div.innerHTML = error;
                errorDiv.appendChild(div);
            })
        }
    })


//Login
    const logInForm = document.querySelector("#login")
    logInForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        let email = document.querySelector("#login input[name='email']").value;
        let password = document.querySelector("#login input[name='password']").value;
        let _csrf = document.querySelector("#sign-up-form input[name='_csrf']").value;

        let result = await fetch("/login", {
            init: {credentials: "same-origin"},
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, _csrf })
        })

        result = await result.json()

        if(!result.errors) {
            location.href = "/routes"
        } else {
            const errorDiv = document.querySelector("#login div.errors");
            errorDiv.innerHTML = "";
            result.errors.forEach(error => {
                const div = document.createElement("div");
                div.innerHTML = error;
                errorDiv.appendChild(div);
            })
        }
    })
})
