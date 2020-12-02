window.addEventListener("DOMContentLoaded", () => {

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
            location.href = "/my-routes";
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

    const newRouteForm = document.querySelector("#create-new-route")
    newRouteForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        let newRoute = document.querySelector("#create-new-route input[name='new-route']").value;
        let _csrf = document.querySelector("#sign-up-form input[name='_csrf']").value;

        let result = await fetch("/my-routes/add", {
            init: {credentials: "same-origin"},
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ newRoute, _csrf})
        })

        result = await result.json();

    })


})
