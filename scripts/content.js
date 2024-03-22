(() => {

    // listening for msg from background.js
    // onMutation observing DOM for buttom-row spawn
    chrome.runtime.onMessage.addListener((msg, sender, response) => {
        const observer = new MutationObserver(onMutation);
        observe();
        const { buttonEnabled, videoID } = msg

        function onMutation() {
            if (document.querySelector('#bottom-row') && !document.querySelector('#anonListButton')) {
                observer.disconnect();
                // Do stuff
                if (buttonEnabled) showButton(videoID);
            }
        }

        function observe() {
            observer.observe(document, { subtree: true, childList: true, });
        }
    });

    let showButton = (videoID) => {
        // Create button element
        let button = document.createElement('BUTTON');
        button.textContent = "+ AnonList"
        button.id = "anonListButton"
        // Add to DOM
        let domNode = document.getElementById("subscribe-button")
        domNode.parentNode.insertBefore(button, domNode.nextSibling)
        // Later add function to deal with button click (add to storage/list) instead of the current console.log
        button.addEventListener("click", () => console.log(videoID));
    }



})();