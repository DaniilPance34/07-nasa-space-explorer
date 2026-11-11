
// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function() {
                console.log("Service worker registered!");
            })
            .catch(function(error) {
                console.error("Service worker error:", error);
            });
    });
}

// Offline indicator
const offlineStatus = document.getElementById("offlineStatus");

function updateConnectionStatus() {
    offlineStatus.hidden = navigator.onLine;
}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
updateConnectionStatus();

// Custom installation prompt
const installButton = document.getElementById("installButton");
let installPrompt = null;

window.addEventListener("beforeinstallprompt", function(event) {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
});

installButton.addEventListener("click", async function() {
    if (!installPrompt) return;

    installPrompt.prompt();
    await installPrompt.userChoice;

    installPrompt = null;
    installButton.hidden = true;
});

window.addEventListener("appinstalled", function() {
    installButton.hidden = true;
    console.log("NASA App installed!");
});

// iPhone instructions
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

if (isIOS && !isStandalone) {
    installButton.hidden = false;

    installButton.addEventListener("click", function() {
        alert(
            "To install on iPhone, open the browser Share menu and choose Add to Home Screen."
        );
    });
}

// Request notification permission
const notificationButton =
    document.getElementById("notificationButton");

notificationButton.addEventListener("click", async function() {
    if (!("Notification" in window)) {
        alert("Notifications are not supported here.");
        return;
    }

    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            alert("Notifications enabled!");
            notificationButton.textContent = "Notifications Enabled";
            notificationButton.disabled = true;
        } else if (permission === "denied") {
            alert("Notification permission was denied.");
        } else {
            alert("Notification permission was not granted.");
        }
    } catch (error) {
        console.error(error);
        alert("Could not request notification permission.");
    }
});
