document.addEventListener("DOMContentLoaded", () => {

    // Map stars to percentage
    function starsToChance(stars) {
        switch (stars) {
            case 0: return 0.0;
            case 1: return 0.07;
            case 2: return 0.11;
            case 3: return 0.15;
            default: return 0.0;
        }
    }

    // Total probability formula
    function calcTotalChance(p1, gp1, gp2, p2, gp3, gp4) {
        const eventChance = (1 - p1) * (1 - p2) * (1 - gp1 / 2) * (1 - gp2 / 2) * (1 - gp3 / 2) * (1 - gp4 / 2);
        return 1 - eventChance * eventChance;
    }

    // Function to update the displayed chance
    function updateChance() {
        const selectors = [
            '[data-group="legacy1-parent"] .selected-image',
            '[data-group="legacy1-grandparent1"] .selected-image',
            '[data-group="legacy1-grandparent2"] .selected-image',
            '[data-group="legacy2-parent"] .selected-image',
            '[data-group="legacy2-grandparent1"] .selected-image',
            '[data-group="legacy2-grandparent2"] .selected-image'
        ];

        const stars = selectors.map(sel => parseInt(document.querySelector(sel).dataset.stars || "0", 10));
        const chances = stars.map(starsToChance);

        const totalChance = calcTotalChance(...chances);

        document.getElementById("result").textContent = `Chance: ${(totalChance * 100).toFixed(2)}%`;
    }

    // Handle image selection
    document.querySelectorAll(".image-picker").forEach(picker => {
        const selectedImg = picker.querySelector(".selected-image");
        const options = picker.querySelectorAll(".option-img");

        options.forEach(option => {
            option.addEventListener("click", (e) => {
                e.stopPropagation();
                selectedImg.src = option.src;
                selectedImg.dataset.stars = option.dataset.stars; // Store star count
                picker.classList.remove("open");
                updateChance(); // Update instantly when an image is picked
            });
        });

        picker.addEventListener("click", (e) => {
            picker.classList.toggle("open");
            e.stopPropagation();
        });
    });

    // Close dropdown when clicking outside
    window.addEventListener("click", () => {
        document.querySelectorAll(".image-picker").forEach(picker => picker.classList.remove("open"));
    });

    // Default display
    document.getElementById("result").textContent = "Chance: 0.00%";

});
