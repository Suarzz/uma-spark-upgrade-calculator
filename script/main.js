document.addEventListener("DOMContentLoaded", () => {

    const slotGroups = [
        "legacy1-parent",
        "legacy1-grandparent1",
        "legacy1-grandparent2",
        "legacy2-parent",
        "legacy2-grandparent1",
        "legacy2-grandparent2"
    ];

    const sparkTypes = ["turf","dirt","short","mile","medium","long","front","pace","late","end"];

    function starsToChance(stars) {
        switch (stars) {
            case 0: return 0.0;
            case 1: return 0.07;
            case 2: return 0.11;
            case 3: return 0.15;
            default: return 0.0;
        }
    }

    function calcTotalChance(p1, gp1, gp2, p2, gp3, gp4) {
        const eventChance = (1 - p1) * (1 - p2) * (1 - gp1 / 2) * (1 - gp2 / 2) * (1 - gp3 / 2) * (1 - gp4 / 2);
        return 1 - eventChance * eventChance;
    }

    function updateAllChances() {
        const tbody = document.querySelector("#results-table tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        sparkTypes.forEach(type => {
            const chances = slotGroups.map(group => {
                const img = document.querySelector(`[data-group="${group}"] .selected-image`);
                if (!img) return 0;
                const stars = parseInt(img.dataset.stars || "0", 10);

                const select = document.querySelector(`.spark-type[data-slot="${group}"]`);
                const slotType = select ? select.value : (img.dataset.sparkType || "none");

                return (slotType === type) ? starsToChance(stars) : 0;
            });

            const total = calcTotalChance(...chances);

            if (total > 0.0001) {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td style="text-transform:capitalize; border-bottom:1px solid #eee;">${type}</td>
                <td style="border-bottom:1px solid #eee;">${(total * 100).toFixed(2)}%</td>
            `;
                tbody.appendChild(row);
            }
        });
    }


    document.querySelectorAll(".image-picker").forEach(picker => {
        const selectedImg = picker.querySelector(".selected-image");
        const options = picker.querySelectorAll(".option-img");

        options.forEach(option => {
            option.addEventListener("click", (e) => {
                e.stopPropagation();

                selectedImg.src = option.src;
                selectedImg.dataset.stars = option.dataset.stars;

                const slot = picker.dataset.group;
                const select = document.querySelector(`.spark-type[data-slot="${slot}"]`);
                if (select) selectedImg.dataset.sparkType = select.value;

                picker.classList.remove("open");
                updateAllChances();
            });
        });

        picker.addEventListener("click", (e) => {
            picker.classList.toggle("open");
            e.stopPropagation();
        });
    });

    window.addEventListener("click", () => {
        document.querySelectorAll(".image-picker").forEach(p => p.classList.remove("open"));
    });

    document.querySelectorAll(".spark-type").forEach(select => {

        const slot = select.dataset.slot;
        const img = document.querySelector(`[data-group="${slot}"] .selected-image`);
        if (img) {
            img.dataset.sparkType = select.value;
        }

        select.addEventListener("change", () => {
            const slot = select.dataset.slot;
            const img = document.querySelector(`[data-group="${slot}"] .selected-image`);
            if (img) img.dataset.sparkType = select.value;
            updateAllChances();
        });
    });
    
    updateAllChances();
});
