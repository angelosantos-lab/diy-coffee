document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. PRODUCT CATALOG: Category Filter & Live Search
    // =========================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("searchInput");
    const productItems = document.querySelectorAll(".product-item");

    if (filterButtons.length > 0 && searchInput) {
        let activeCategory = "all";

        function filterProducts() {
            const query = searchInput.value.toLowerCase().trim();

            productItems.forEach((item) => {
                const category = item.getAttribute("data-category");
                const name = item.getAttribute("data-name") || item.textContent.toLowerCase();

                const matchesCategory = activeCategory === "all" || category === activeCategory;
                const matchesSearch = name.includes(query);

                item.style.display = matchesCategory && matchesSearch ? "" : "none";
            });
        }

        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                // Reset button styles
                filterButtons.forEach((b) => {
                    b.classList.remove("active", "custom-btn");
                    b.classList.add("btn-outline-success");
                });

                // Highlight selected filter button
                btn.classList.add("active", "custom-btn");
                btn.classList.remove("btn-outline-success");

                activeCategory = btn.getAttribute("data-category");
                filterProducts();
            });
        });

        searchInput.addEventListener("input", filterProducts);
    }

    // =========================================
    // 2. PRODUCT CATALOG: Interactive Shopping Cart
    // =========================================
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    const cartItemsList = document.getElementById("cartItems");
    const cartTotalEl = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const clearCartBtn = document.getElementById("clearCartBtn");
    const checkoutAlert = document.getElementById("checkoutAlert");

    let cart = [];

    function updateCartUI() {
        if (!cartItemsList || !cartTotalEl) return;

        cartItemsList.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li class="list-group-item text-muted text-center">Your cart is empty.</li>';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.qty;

                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <div>
                        <span>${item.name}</span>
                        <small class="text-muted d-block">₱${item.price} x ${item.qty}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <strong>₱${item.price * item.qty}</strong>
                        <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2 remove-item-btn" data-index="${index}" aria-label="Remove ${item.name}">&times;</button>
                    </div>
                `;
                cartItemsList.appendChild(li);
            });

            if (checkoutBtn) checkoutBtn.disabled = false;

            // Attach remove handlers to individual item buttons
            document.querySelectorAll(".remove-item-btn").forEach((removeBtn) => {
                removeBtn.addEventListener("click", () => {
                    const idx = parseInt(removeBtn.getAttribute("data-index"), 10);
                    cart.splice(idx, 1);
                    updateCartUI();
                });
            });
        }

        cartTotalEl.textContent = `₱${total.toLocaleString()}`;
    }

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));

            const existingItem = cart.find((item) => item.name === name);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            if (checkoutAlert) checkoutAlert.classList.add("d-none");
            updateCartUI();
        });
    });

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            cart = [];
            if (checkoutAlert) checkoutAlert.classList.add("d-none");
            updateCartUI();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (checkoutAlert) checkoutAlert.classList.remove("d-none");
            cart = [];
            updateCartUI();
        });
    }

    // =========================================
    // 3. ABOUT US: Café vs. DIY Savings Calculator
    // =========================================
    const cupsSlider = document.getElementById("cupsPerWeek");
    const cupsDisplay = document.getElementById("cupsDisplay");
    const cafeCostEl = document.getElementById("cafeCost");
    const diyCostEl = document.getElementById("diyCost");
    const monthlySavingsEl = document.getElementById("monthlySavings");

    if (cupsSlider && cupsDisplay && cafeCostEl && diyCostEl && monthlySavingsEl) {
        function calculateSavings() {
            const cups = parseInt(cupsSlider.value, 10);
            const monthlyCups = cups * 4;
            const cafeTotal = monthlyCups * 175; // Avg ₱175 café drink
            const diyTotal = monthlyCups * 60;   // Avg ₱60 DIY drink
            const savings = cafeTotal - diyTotal;

            cupsDisplay.textContent = `${cups} ${cups === 1 ? "cup" : "cups"}`;
            cafeCostEl.textContent = `₱${cafeTotal.toLocaleString()}`;
            diyCostEl.textContent = `₱${diyTotal.toLocaleString()}`;
            monthlySavingsEl.textContent = `₱${savings.toLocaleString()}`;
        }

        cupsSlider.addEventListener("input", calculateSavings);
        calculateSavings();
    }

    // =========================================
    // 4. CONTACT US: Form Validation & Simulated Confirmation
    // =========================================
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("fullName");
            const email = document.getElementById("emailAddress");
            const subject = document.getElementById("subjectSelect");
            const message = document.getElementById("messageText");
            const formSuccess = document.getElementById("formSuccess");
            const confirmationDetails = document.getElementById("confirmationDetails");

            let isValid = true;

            // Validate Name
            if (fullName.value.trim().length < 2) {
                fullName.classList.add("is-invalid");
                isValid = false;
            } else {
                fullName.classList.remove("is-invalid");
            }

            // Validate Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                email.classList.add("is-invalid");
                isValid = false;
            } else {
                email.classList.remove("is-invalid");
            }

            // Validate Topic
            if (subject.value === "") {
                subject.classList.add("is-invalid");
                isValid = false;
            } else {
                subject.classList.remove("is-invalid");
            }

            // Validate Message
            if (message.value.trim().length < 10) {
                message.classList.add("is-invalid");
                isValid = false;
            } else {
                message.classList.remove("is-invalid");
            }

            // Display simulated confirmation if all fields pass
            if (isValid) {
                const selectedTopic = subject.options[subject.selectedIndex].text;
                confirmationDetails.textContent = `Thank you, ${fullName.value.trim()}! We received your inquiry regarding "${selectedTopic}" and will reply to ${email.value.trim()} shortly. (Front-End Prototype Simulation)`;
                formSuccess.classList.remove("d-none");
                contactForm.reset();
            } else {
                formSuccess.classList.add("d-none");
            }
        });
    }
});
