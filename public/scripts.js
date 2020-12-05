window.addEventListener("DOMContentLoaded", () => {


    // Sign-Up
    const signUpForm = document.querySelector("#sign-up-form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            let username = document.querySelector("#sign-up-form input[name='username']").value; // CSS selectors (space = a descendant)
            let email = document.querySelector("#sign-up-form input[name='email']").value;
            let password = document.querySelector("#sign-up-form input[name='password']").value;
            let confirmPassword = document.querySelector("#sign-up-form input[name='confirmPassword']").value;
            let _csrf = document.querySelector("#sign-up-form input[name='_csrf']").value;

            let result = await fetch("/sign-up", {
                init: { credentials: "same-origin" },
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, confirmPassword, _csrf })
            });

            result = await result.json();

            if (!result.errors) {
                location.href = "/my-routes";
                return;
            } else {
                let errorContent = ""
                result.errors.forEach(error => {
                    const errorDiv = document.querySelector("#sign-up-form div.errors");
                    errorDiv.innerHTML = "";
                    const p = document.createElement("p");
                    errorContent = `${errorContent}
                    - ${error}
                    </br>`;
                    p.innerHTML = errorContent;
                    errorDiv.appendChild(p);
                });
            };
        });
    };


    //Login
    const logInForm = document.querySelector("#login");
    if (logInForm) {
        logInForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            let email = document.querySelector("#login input[name='email']").value;
            let password = document.querySelector("#login input[name='password']").value;
            let _csrf = document.querySelector("#sign-up-form input[name='_csrf']").value;

            let result = await fetch("/login", {
                init: { credentials: "same-origin" },
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, _csrf })
            });

            result = await result.json();

            if (!result.errors) {
                location.href = "/my-routes";
            } else {
                const errorDiv = document.querySelector("#login div.errors");
                errorDiv.innerHTML = "";
                result.errors.forEach(error => {
                    const div = document.createElement("div");
                    div.innerHTML = error;
                    errorDiv.appendChild(div);
                });
            };
        });
    };

    // const newRouteForm = document.querySelector("#create-new-route")
    // newRouteForm.addEventListener("submit", async(e) => {
    //     e.preventDefault();

    //     let newRoute = document.querySelector("#create-new-route input[name='new-route']").value;
    //     let _csrf = document.querySelector("#sign-up-form input[name='_csrf']").value;

    //     let result = await fetch("/my-routes/add", {
    //         init: {credentials: "same-origin"},
    //         method: "POST",
    //         headers: { "Content-Type": "application/json"},
    //         body: JSON.stringify({ newRoute, _csrf})
    //     })

    //     result = await result.json();

    // })
    const newRouteForm = document.querySelector("#create-new-route");
    if (newRouteForm) {
        newRouteForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            let newRoute = document.querySelector("#create-new-route input[name='new-route']").value;
            let _csrf = document.querySelector("#sign-up-form input[name='_csrf']").value;

            let result = await fetch("/my-routes/add", {
                init: { credentials: "same-origin" },
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newRoute, _csrf })
            });

            result = await result.json();

        });
    };

    //Add Park to the Rout on park page
    const myRoutesatParkPage = document.querySelector(".my-routes");
    const addToRoute = document.querySelector(".my-routes .add-to-route");
    if (addToRoute) {
        addToRoute.addEventListener("click", e => {
            myRoutesatParkPage.classList.toggle("open");
        });
    };


    const editReviewButtons = document.querySelectorAll(".reviews a.review-edit");
    if (editReviewButtons) {
        editReviewButtons.forEach(button => {
            button.addEventListener("click", (e) => {

                const id = parseInt(e.target.id.slice(11));

                const form = document.createElement("form");
                form.setAttribute("action", "/reviews/edit/" + id);

                form.setAttribute("method", "post");

                const csrfToken = document.querySelector("#csrfToken").value;
                const review = document.querySelector("#review" + id + " p").innerText;
                const inputs = `<input type="hidden" name="_csrf" value=${csrfToken}> <textarea name="text" id="review-text-box">${review}</textarea> <input type="submit" value="Update-Review">`;

                form.innerHTML = inputs;
                document.querySelector("#review" + id).appendChild(form);
            });
        });
    };
});
