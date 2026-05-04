// ===============================
// GLOBAL INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("AgroLink UI Loaded");

    initTooltips();
    initAutoFocus();
    initConfirmActions();
});


// ===============================
// TOAST SYSTEM
// ===============================
function showToast(message, type = "success") {

    const colors = {
        success: "bg-green-600",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500"
    };

    const toast = document.createElement("div");

    toast.className = `
        ${colors[type]} text-white px-4 py-2 rounded shadow-lg
        fixed top-5 right-5 z-50 transition opacity-0 translate-y-2
    `;

    toast.innerText = message;

    document.body.appendChild(toast);

    // show
    setTimeout(() => {
        toast.classList.remove("opacity-0", "translate-y-2");
    }, 100);

    // hide
    setTimeout(() => {
        toast.classList.add("opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


// ===============================
// CONFIRM DELETE / ACTION
// ===============================
function confirmAction(message = "Are you sure?") {
    return confirm(message);
}


// Auto attach confirm to buttons
function initConfirmActions() {
    document.querySelectorAll("[data-confirm]").forEach(btn => {
        btn.addEventListener("click", function (e) {
            const msg = this.getAttribute("data-confirm");

            if (!confirm(msg)) {
                e.preventDefault();
            }
        });
    });
}


// ===============================
// LOADER
// ===============================
function showLoader() {
    const loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div class="loader"></div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.remove();
}


// ===============================
// FORM SUBMIT LOADING
// ===============================
document.addEventListener("submit", function (e) {
    const form = e.target;

    if (form.classList.contains("no-loader")) return;

    showLoader();
});


// ===============================
// AUTO FOCUS INPUT
// ===============================
function initAutoFocus() {
    const input = document.querySelector("[data-autofocus]");
    if (input) input.focus();
}


// ===============================
// MODAL SYSTEM
// ===============================
function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}


// Close modal on background click
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-backdrop")) {
        e.target.classList.add("hidden");
    }
});


// ===============================
// TOOLTIP (simple)
// ===============================
function initTooltips() {
    document.querySelectorAll("[data-tooltip]").forEach(el => {

        el.addEventListener("mouseenter", function () {
            const tooltip = document.createElement("div");
            tooltip.className = "absolute bg-black text-white text-xs px-2 py-1 rounded";
            tooltip.innerText = this.getAttribute("data-tooltip");

            tooltip.style.top = (this.offsetTop - 30) + "px";
            tooltip.style.left = this.offsetLeft + "px";

            tooltip.id = "tooltip";
            document.body.appendChild(tooltip);
        });

        el.addEventListener("mouseleave", function () {
            const tooltip = document.getElementById("tooltip");
            if (tooltip) tooltip.remove();
        });
    });
}


// ===============================
// COPY TO CLIPBOARD
// ===============================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "info");
}


// ===============================
// TABLE SEARCH FILTER
// ===============================
function filterTable(inputId, tableId) {

    const input = document.getElementById(inputId);
    const filter = input.value.toLowerCase();

    const rows = document.querySelectorAll(`#${tableId} tbody tr`);

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}


// ===============================
// IMAGE PREVIEW (UPLOAD)
// ===============================
function previewImage(input, previewId) {

    const file = input.files[0];
    const preview = document.getElementById(previewId);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove("hidden");
    };

    reader.readAsDataURL(file);
}


// ===============================
// SMOOTH SCROLL
// ===============================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ===============================
// AUTO HIDE ALERTS
// ===============================
setTimeout(() => {
    document.querySelectorAll(".auto-hide").forEach(el => {
        el.style.display = "none";
    });
}, 3000);