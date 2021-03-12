window.addEventListener("DOMContentLoaded", () => {

    /* ERROR HANDLING */
    const closeButton = document.querySelector(".close-button");
    const closeCount = document.querySelector(".close-button .count");
    const errorDiv = document.querySelector("div.errors");
    const errorList = document.querySelector("ul.errors-list");

    closeButton.addEventListener("click", () => {
        errorDiv.classList.remove("show");
    })

    let intervals = new Set();

    const errorHandle = (errors) => {
        const clearAllIntervals = () => {
            intervals.forEach(interval => {
                clearInterval(interval);
            })
            intervals = new Set ();
        }
        
        const countdown = () => {
            clearAllIntervals();
            let n = 5;
            closeCount.innerHTML = n;
            let interval = setInterval(()=>{
                if (n===0) {
                    clearAllIntervals();
                } else {
                    n --;
                    closeCount.innerHTML = n;
                }
            },1000)
            intervals.add(interval);
        }

        errorList.innerHTML = "";
        errors.forEach(error => {
            const p = document.createElement("li");
            p.innerHTML = error;
            errorList.appendChild(p);
        });
        errorDiv.classList.add("show");
        countdown();
        let timeout = setTimeout(()=>{
            errorDiv.classList.remove("show");
        }, 5000)
        intervals.add(timeout);
    }
    
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
                errorHandle(result.errors);
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
                errorHandle(result.errors);
            };
        });
    };

    const newRouteForm = document.querySelector("#create-new-route")
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

                const id = parseInt(e.target.id.slice(11))
                let form = document.querySelector(`#review${id} form`)

                if (!form) {
                    form = document.createElement("form")
                    form.setAttribute("action", "/reviews/edit/" + id)
                    form.setAttribute("method", "post")
                    form.setAttribute("class", "review-form")
                    const csrfToken = document.querySelector("#csrfToken").value
                    const review = document.querySelector("#review" + id + " p").innerText
                    const inputs = `<input type="hidden" name="_csrf" value=${csrfToken}> <textarea name="text" id="review-input " required>${review}</textarea>`
                    form.innerHTML = inputs
                    const controls = document.createElement("div");
                    controls.setAttribute("class","review-controls");
                    controls.innerHTML = `<input type="submit" value="UPDATE REVIEW">`;
                    const cancelButton = document.createElement("button");
                    cancelButton.innerHTML = "CANCEL"
                    cancelButton.addEventListener("click", () => {
                        form.remove();
                    })
                    controls.appendChild(cancelButton);
                    form.appendChild(controls);
                }


                document.querySelector("#review" + id).appendChild(form)
            })
        })
    }

    const removeVisitedButtons = document.querySelectorAll(".remove-button > a.button");
    const removeButtonClick = e => {
        let parent = e.target.parentNode;
        let confirmation = document.querySelector(`#${parent.id} .remove-confirmation`)
        confirmation.classList.remove("hidden")
    }
    
    removeVisitedButtons.forEach(button => {
        button.addEventListener("click", removeButtonClick);
    });
    
    const cancelRemoveButtons = document.querySelectorAll(".remove-confirmation a.cancel");
    const cancelButtonClick = e => {
        let parent = e.target.parentNode;
        parent.classList.add("hidden");
    }
    
    cancelRemoveButtons.forEach(button => {
        button.addEventListener("click", cancelButtonClick);
    });
});
