// In-page cache of the user's storage
const options = {};
let playlists = [];
// Initialize the form with the user's option settings
chrome.storage.sync.get('options', (data) => {
    Object.assign(options, data.options);
    optionsForm.showButton.checked = Boolean(options.showButton);
});

//Force Data Refresh
document.addEventListener('DOMContentLoaded', () => {
    getFromStorage(); // Fetch and display latest playlists
})

// Initialize the Playlists area with the user's playlists
const getFromStorage = async () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['playlists'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Error retrieving playlists:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                try {
                    const savedPlaylists = result.playlists;

                    // Ensure playlists is an array
                    playlists = Array.isArray(savedPlaylists) ? savedPlaylists : [];

                    console.log('Retrieved playlists:', playlists);
                    populateList(playlists); // Ensure UI updates correctly
                    resolve(playlists);
                } catch (error) {
                    console.error('Error processing playlists:', error);
                    reject(error);
                }
            }
        });
    });
};


// Immediately persist options changes.
optionsForm.showButton.addEventListener('change', (event) => {
    options.showButton = event.target.checked;
    chrome.storage.sync.set({
        options,
    });
});

// Initialize ol with playlists from user's saved playlists
const createListItem = (playlist, playlistId) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item list-group-item-action';
    listItem.id = playlistId;

    listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <div class="fw-semibold">${playlist.Title}</div>
            <span class="badge bg-primary rounded-pill">${Object.keys(playlist.Ids).length}</span>
        </div>
        <p class="card-text"><small class="text-muted">${playlist.Date}</small></p>
        <div class="btn-group position-absolute bottom-0 end-0" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light btn-sm" name="shufflePlaylist">
                <svg pointer-events="none" width="32px" height="32px" viewBox="0 0 64 64" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet">
                            <circle cx="32" cy="32" r="30" fill="#4fd1d9">
                            </circle>
                            <g fill="#ffffff">
                                <path d="M49 39.6L42.6 46v-3.9H37c-1.6 0-4.5-1-5.7-4.7L29.7 33l-1.6-4.6c-.3-1.1-.8-1.2-1-1.3H15v-5h12.2c1.6 0 4.5 1 5.7 4.7l1.6 4.4l1.6 4.6c.3 1.1.8 1.2 1 1.3h5.5v-3.9l6.4 6.4">
                                </path>
                                <path d="M28.4 35l-.2.7c-.3 1.1-.8 1.2-1 1.3H15v5h12.2c.9 0 2.3-.3 3.5-1.4c-.5-.8-1-1.6-1.3-2.7l-1-2.9">
                                </path>
                                <path d="M35.8 29l.3-.8c.3-1.1.8-1.2 1-1.3h5.5v3.9l6.4-6.4l-6.4-6.4v3.9H37c-.9 0-2.4.4-3.6 1.4c.6.8 1 1.7 1.4 2.8l1 2.9">
                                </path>
                            </g>
                        </svg>
            </button>
            <button type="button" class="btn btn-light btn-sm" name="quickAddBtn">
                <svg pointer-events="none" width="32px" height="32px" viewBox="0 0 32 32"
                            enable-background="new 0 0 32 32">
                            <g id="add">
                                <g>
                                    <g>
                                        <path fill="#FDCB58"
                                            d="M4.743,2.496C4.266,2.223,4,2.45,4,3v26c0,0.55,0.266,0.776,0.743,0.504l22.701-13.008     c0.478-0.273,0.509-0.719,0.031-0.992L4.743,2.496z" />
                                        <path
                                            d="M4.385,30.619L4.385,30.619C3.718,30.619,3,30.112,3,29V3c0-1.113,0.718-1.62,1.385-1.62c0.28,0,0.567,0.083,0.854,0.248     l22.733,13.008c0.538,0.308,0.846,0.798,0.846,1.347c0,0.559-0.32,1.063-0.878,1.382L5.24,30.371     C4.952,30.536,4.665,30.619,4.385,30.619z M5.003,3.797L5,28.203l21.314-12.212L5.003,3.797z" />
                                    </g>
                                    <g>
                                        <line x1="28" x2="20" y1="26" y2="26" />
                                        <path d="M28,27h-8c-0.552,0-1-0.447-1-1s0.448-1,1-1h8c0.552,0,1,0.447,1,1S28.552,27,28,27z" />
                                    </g>
                                    <g>
                                        <line x1="24" x2="24" y1="22" y2="30" />
                                        <path
                                            d="M24,31c-0.552,0-1-0.447-1-1v-8c0-0.553,0.448-1,1-1s1,0.447,1,1v8C25,30.553,24.552,31,24,31z" />
                                    </g>
                                </g>
                            </g>
                        </svg>
            </button>
            <button type="button" class="btn btn-light btn-sm" name="copyPlaylistBtn">
                <svg pointer-events="none" width="25"
                            viewBox="0 0 115.77 122.88" style="enable-background:new 0 0 115.77 122.88">
                            <style type="text/css">
                                .st0 {
                                    fill-rule: evenodd;
                                    clip-rule: evenodd;
                                }
                            </style>
                            <g>
                                <path class="st0"
                                    d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" />
                            </g>
                        </svg>
                    </button>
            <button type="button" class="btn btn-light btn-sm" name="editPlaylistBtn">
                <svg pointer-events="none" width="25"
                            viewBox="0 0 122.88 121.96" style="enable-background:new 0 0 122.88 121.96">
                            <style type="text/css">
                                .st0 {
                                    fill-rule: evenodd;
                                    clip-rule: evenodd;
                                }
                            </style>
                            <g>
                                <path class="st0"
                                    d="M107.73,1.31c-0.96-0.89-2.06-1.37-3.29-1.3c-1.23,0-2.33,0.48-3.22,1.44l-7.27,7.54l20.36,19.67l7.33-7.68 c0.89-0.89,1.23-2.06,1.23-3.29c0-1.23-0.48-2.4-1.37-3.22L107.73,1.31L107.73,1.31L107.73,1.31z M8.35,5.09h50.2v13.04H14.58 c-0.42,0-0.81,0.18-1.09,0.46c-0.28,0.28-0.46,0.67-0.46,1.09v87.71c0,0.42,0.18,0.81,0.46,1.09c0.28,0.28,0.67,0.46,1.09,0.46 h87.71c0.42,0,0.81-0.18,1.09-0.46c0.28-0.28,0.46-0.67,0.46-1.09V65.1h13.04v48.51c0,2.31-0.95,4.38-2.46,5.89 c-1.51,1.51-3.61,2.46-5.89,2.46H8.35c-2.32,0-4.38-0.95-5.89-2.46C0.95,118,0,115.89,0,113.61V13.44c0-2.32,0.95-4.38,2.46-5.89 C3.96,6.04,6.07,5.09,8.35,5.09L8.35,5.09z M69.62,75.07c-2.67,0.89-5.42,1.71-8.09,2.61c-2.67,0.89-5.35,1.78-8.09,2.67 c-6.38,2.06-9.87,3.22-10.63,3.43c-0.75,0.21-0.27-2.74,1.3-8.91l5.07-19.4l0.42-0.43l20.02,20.02L69.62,75.07L69.62,75.07 L69.62,75.07z M57.01,47.34L88.44,14.7l20.36,19.6L77.02,67.35L57.01,47.34L57.01,47.34z" />
                            </g>
                        </svg>
            </button>
            <button type="button" class="btn btn-light btn-sm" name="deletePlaylistBtn">
                <svg pointer-events="none" width="25"
                            viewBox="0 0 105.16 122.88">
                            <defs>
                                <style>
                                    .cls-1 {
                                        fill-rule: evenodd;
                                    }
                                </style>
                            </defs>
                            <path fill="#BE1931" class="cls-1"
                                d="M11.17,37.16H94.65a8.4,8.4,0,0,1,2,.16,5.93,5.93,0,0,1,2.88,1.56,5.43,5.43,0,0,1,1.64,3.34,7.65,7.65,0,0,1-.06,1.44L94,117.31v0l0,.13,0,.28v0a7.06,7.06,0,0,1-.2.9v0l0,.06v0a5.89,5.89,0,0,1-5.47,4.07H17.32a6.17,6.17,0,0,1-1.25-.19,6.17,6.17,0,0,1-1.16-.48h0a6.18,6.18,0,0,1-3.08-4.88l-7-73.49a7.69,7.69,0,0,1-.06-1.66,5.37,5.37,0,0,1,1.63-3.29,6,6,0,0,1,3-1.58,8.94,8.94,0,0,1,1.79-.13ZM5.65,8.8H37.12V6h0a2.44,2.44,0,0,1,0-.27,6,6,0,0,1,1.76-4h0A6,6,0,0,1,43.09,0H62.46l.3,0a6,6,0,0,1,5.7,6V6h0V8.8h32l.39,0a4.7,4.7,0,0,1,4.31,4.43c0,.18,0,.32,0,.5v9.86a2.59,2.59,0,0,1-2.59,2.59H2.59A2.59,2.59,0,0,1,0,23.62V13.53H0a1.56,1.56,0,0,1,0-.31v0A4.72,4.72,0,0,1,3.88,8.88,10.4,10.4,0,0,1,5.65,8.8Zm42.1,52.7a4.77,4.77,0,0,1,9.49,0v37a4.77,4.77,0,0,1-9.49,0v-37Zm23.73-.2a4.58,4.58,0,0,1,5-4.06,4.47,4.47,0,0,1,4.51,4.46l-2,37a4.57,4.57,0,0,1-5,4.06,4.47,4.47,0,0,1-4.51-4.46l2-37ZM25,61.7a4.46,4.46,0,0,1,4.5-4.46,4.58,4.58,0,0,1,5,4.06l2,37a4.47,4.47,0,0,1-4.51,4.46,4.57,4.57,0,0,1-5-4.06l-2-37Z" />
                        </svg>
            </button>
        </div>
    `;
    return listItem;
};

const populateList = (playlists) => {
    const orderedList = document.getElementById('orderedList');
    orderedList.innerHTML = ''; // Clear existing list items

    // Log the playlists to check their content and type
    console.log('Playlists:', playlists);
    console.log('Type of playlists:', Array.isArray(playlists) ? 'Array' : typeof playlists);

    // Ensure playlists is an array
    if (!Array.isArray(playlists)) {
        playlists = []; // Default to an empty array if it's not an array
    }

    if (playlists.length === 0) {
        // Create and append a message indicating no playlists are available
        const noPlaylistsMessage = document.createElement('li');
        noPlaylistsMessage.className = 'list-group-item text-center';
        noPlaylistsMessage.textContent = 'No playlists available.';
        orderedList.appendChild(noPlaylistsMessage);
    } else {
        // Populate the list with playlist items
        playlists.forEach((playlist, index) => {
            orderedList.appendChild(createListItem(playlist, index));
        });
    }
};


document.getElementById('orderedList').addEventListener('click', async (event) => {
    const target = event.target.closest('button');
    if (!target) return;

    let playlistId = target.closest('li').id;
    let playlist = playlists[playlistId];

    if (!playlist) {
        console.error(`Playlist with ID ${playlistId} not found.`);
        return;
    }

    switch (target.name) {
        case 'copyPlaylistBtn':
            {
                // Handle case for copying playlist
                let videoIds = playlist.Ids.map(item => item.id);
                console.log('Video IDs:', videoIds);

                let playlistUrl = new URL('https://www.youtube.com/watch_videos');
                const params = new URLSearchParams();
                params.set('video_ids', videoIds.join(','));

                playlistUrl.search = params.toString();
                console.log('Constructed Playlist URL:', playlistUrl.href);
                copyPlaylist(playlistUrl.href);
            }
            break;

        case 'editPlaylistBtn':
            {
                // Handle case for editing playlist
                editPlaylist(playlistId);
            }
            break;

        case 'deletePlaylistBtn':
            {
                // Handle case for deleting playlist
                deletePlaylist(playlistId);
            }
            break;

        case 'quickAddBtn':
            {
                // Handle case for quickly adding video
                await quickAdd(playlistId);
            }
            break;

        case 'shufflePlaylist':
            {
                // Handle case for shuffling playlist
                await shufflePlaylist(playlistId);
                // Ensure to refresh the playlist data after shuffling
                await getFromStorage(); // Refresh playlists from storage
            }
            break;

        default:
            {
                // Default case to resolve and open playlist URL
                let videoIds = playlist.Ids.map(item => item.id);
                console.log('Video IDs:', videoIds);

                if (videoIds.length > 0) {
                    let playlistUrl = new URL('https://www.youtube.com/watch_videos');
                    const params = new URLSearchParams();
                    params.set('video_ids', videoIds.join(','));

                    playlistUrl.search = params.toString();
                    console.log('Constructed Playlist URL:', playlistUrl.href);

                    try {
                        const resolvedUrl = await resolvePlaylistUrl(playlistUrl.href);
                        console.log('Resolved URL:', resolvedUrl);
                        chrome.tabs.create({ active: true, url: resolvedUrl });
                    } catch (error) {
                        console.error('Error resolving URL:', error);
                    }
                } else {
                    console.warn('No videos in the playlist.');
                }
            }
            break;
    }

    // Update UI with the latest playlist state
    populateList(playlists);
});


const getVideoTitle = async (windowTitle, videoId) => {
    try {
        const response = await fetch("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + videoId);
        const json = await response.json();
        const videoTitle = json.title;
        return videoTitle;

    }
    catch {
        //windowTitle
        return windowTitle;
    }
}

const resolvePlaylistUrl = async (playlistUrl) => {
    return await fetch(playlistUrl).then((r) => r.url).then((result) => {
        playlistUrl = result;
        return playlistUrl;
    }).catch((error) => {
        return playlistUrl;
    });
};
const getCurrentTab = async () => {
    const queryOptions = {
        active: true,
        currentWindow: true
    };
    const tabs = await chrome.tabs.query(queryOptions);
    return tabs[0];
};

const quickAdd = async (playlistId) => {
    try {
        const currentTab = await getCurrentTab();
        const currentTabUrl = new URL(currentTab.url);
        
        if (currentTabUrl.hostname === 'www.youtube.com' && currentTabUrl.pathname === '/watch') {
            const videoId = currentTabUrl.searchParams.get('v');
            const windowTitle = currentTab.title.replace(' - YouTube', '');
            const videoTitle = await getVideoTitle(windowTitle, videoId);
            
            // Check if the playlist exists
            if (playlists[playlistId]) {
                // Check if the video already exists in the playlist
                const videoExists = playlists[playlistId].Ids.some(video => video.id === videoId);
                
                if (!videoExists) {
                    // Add the new video to the playlist
                    playlists[playlistId].Ids.push({
                        id: videoId,
                        title: videoTitle
                    });

                    // Save the updated playlist to local storage
                    chrome.storage.local.set({ playlists }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('Error storing data to local storage:', chrome.runtime.lastError);
                        }
                    });

                    // Update the UI with the latest data
                    getFromStorage();
                } else {
                    console.log('Video already exists in the playlist.');
                }
            } else {
                console.error('Playlist not found:', playlistId);
            }
        } else {
            console.error('Current tab is not a YouTube watch page.');
        }
    } catch (error) {
        console.error('Error in quickAdd:', error);
    }
};


const copyPlaylist = (playlistUrl) => {
    resolvePlaylistUrl(playlistUrl).then(async (res) => {
        playlistUrl = res;
        await navigator.clipboard.writeText(playlistUrl);
        console.log('Playlist Link Copied To Clipboard');
    });
};

const editPlaylist = (playlistId) => {
    modelElm.setAttribute('playlistId', playlistId); // Set playlistId here
    myModal.show();
};

// Modal setup
const modelElm = document.querySelector('#exampleModal');
const myModal = bootstrap.Modal.getOrCreateInstance(modelElm);

modelElm.addEventListener('shown.bs.modal', event => {
    document.getElementById('modalList').innerHTML = '';
    const modalTitle = modelElm.querySelector('.modal-title');
    const playlistId = modelElm.getAttribute('playlistId'); // Get playlistId from the modal's attribute

    if (playlists[playlistId]) {
        modalTitle.textContent = playlists[playlistId].Title || 'Untitled Playlist';

        // Iterate over the array of objects in Ids
        playlists[playlistId].Ids.forEach(video => {
            let listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex';
            listItem.setAttribute('id', video.id); // Set id as the item's id
            document.getElementById('modalList').insertAdjacentElement('afterBegin', listItem);

            let videoTitleLabel = document.createElement('div');
            videoTitleLabel.textContent = video.title; // Use video.title
            videoTitleLabel.className = 'd-inline-block p-2 w-75';
            listItem.appendChild(videoTitleLabel);

            let deleteVidBtn = document.createElement('button');
            deleteVidBtn.className = 'btn btn-danger p-2 flex-shrink-1';
            deleteVidBtn.textContent = 'Remove';
            listItem.appendChild(deleteVidBtn);

            deleteVidBtn.addEventListener('click', (event) => {
                const idToRemove = event.target.closest('li').getAttribute('id');
                // Remove the video from the array based on id
                playlists[playlistId].Ids = playlists[playlistId].Ids.filter(video => video.id !== idToRemove);
                event.target.closest('li').remove();

                chrome.storage.local.set({ playlists }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error storing data:', chrome.runtime.lastError);
                    } else {
                        console.log('Data successfully saved.');
                    }
                });

                getFromStorage();
            });
        });
    }
});

modelElm.addEventListener('hide.bs.modal', event => {
    const playlistId = modelElm.getAttribute('playlistId');
    const newTitle = document.querySelector('#floatingTextarea').value.trim();

    if (newTitle && playlists[playlistId]) {
        playlists[playlistId].Title = newTitle;

        chrome.storage.local.set({ playlists }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error storing data:', chrome.runtime.lastError);
            } else {
                console.log('Data successfully saved.');
            }
        });

        document.querySelector('#floatingTextarea').value = '';
        getFromStorage();
    }
});


// Function to shuffle an array in place
const shuffleArray = (array) => {
    console.log('Shuffling array:', array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    console.log('Shuffled array:', array);
};

// Function to shuffle the playlist at a given index
const shufflePlaylist = async (index) => {
    try {
        console.log('Attempting to shuffle playlist at index:', index);

        // Retrieve playlists from storage
        chrome.storage.local.get(['playlists'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Error retrieving playlists:', chrome.runtime.lastError);
                return;
            }

            let playlists = result.playlists || [];
            
            // Check if the index is valid
            if (index >= 0 && index < playlists.length) {
                const playlist = playlists[index];
                console.log('Original playlist:', playlist);

                // Check if playlist.Ids is an array and shuffle it
                if (Array.isArray(playlist.Ids)) {
                    console.log('Before shuffling IDs:', playlist.Ids);
                    shuffleArray(playlist.Ids);
                    console.log('After shuffling IDs:', playlist.Ids);

                    // Save the shuffled playlist back to storage
                    playlists[index] = playlist; // Update the playlist in the array

                    chrome.storage.local.set({ playlists: playlists }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('Error saving shuffled playlist:', chrome.runtime.lastError);
                        } else {
                            console.log('Successfully saved shuffled playlist:', playlist);
                        }
                    });
                } else {
                    console.error('Playlist IDs is not an array:', playlist.Ids);
                }
            } else {
                console.error('Invalid playlist index:', index);
            }
        });
    } catch (error) {
        console.error('Error in shufflePlaylist function:', error);
    }
};

const deletePlaylist = (playlistId) => {
    playlists.splice(playlistId, 1);
    chrome.storage.local.set({ playlists }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error storing data:', chrome.runtime.lastError);
        }
    });
    getFromStorage();
};

async function savePlaylists() {
    return new Promise((resolve, reject) => {
        // Assuming you're using browser storage (e.g., localStorage)
        try {
            localStorage.setItem('playlists', JSON.stringify(playlists));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// UI TRIGGERS FOR EXPORT/IMPORT ARE YET TO BE IMPLEMENTED
const exportPlaylists = () => {
    chrome.storage.local.get('playlists', ({ playlists }) => {
        try {
            const playlistsJSON = JSON.stringify(playlists);
            const blob = new Blob([playlistsJSON], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'Anonlist-playlists.json';
            a.click();

            URL.revokeObjectURL(url);
            console.log('Playlists exported successfully!');
        } catch (error) {
            console.error('Error exporting playlists:', error);
        }
    });
};

// Example usage
const exportButton = document.getElementById('export-button');
exportButton.addEventListener('click', exportPlaylists);

const importPlaylists = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const playlistsJSON = e.target.result;
            const playlists = JSON.parse(playlistsJSON);

            if (!Array.isArray(playlists)) {
                console.error('Invalid playlists format. Expected an array.');
                return;
            }

            chrome.storage.local.set({ playlists }, () => {
                console.log('Playlists imported successfully!');
                getFromStorage();
            });
        } catch (error) {
            console.error('Error importing playlists:', error);
        }
    };

    reader.onerror = (e) => {
        console.error('Error reading file:', e.target.error);
    };

    reader.readAsText(file);
    event.target.value = null;
};

// Example usage
const fileInput = document.getElementById('file-import');
fileInput.addEventListener('change', importPlaylists);

const showPlaylistFormBtn = document.querySelector('#showPlaylistFormBtn');
showPlaylistFormBtn.addEventListener('click', () => {
    const newPlaylistForm = document.querySelector('#newPlaylistForm');
    newPlaylistForm.classList.remove('d-none');
    document.querySelector('#showPlaylistFormBtn').parentElement.classList.add('d-none');
});

// Creating new Playlist and persist changes to Playlists in storage.
const createPlaylistBtn = document.querySelector('#createPlaylistBtn');
createPlaylistBtn.addEventListener('click', (event) => {
    if (document.querySelector('#playlistTitle').value.length > 0) {
        const title = document.querySelector('#playlistTitle').value;
        const date = new Date().toLocaleString();
        const ids = {};
        playlists.unshift({
            Title: title,
            Date: date,
            Ids: ids,
        });

        chrome.storage.local.set({ playlists }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error storing data:', chrome.runtime.lastError);
            }
        });

        document.querySelector('#playlistTitle').value = '';
        event.target.parentElement.classList.add('d-none');
        createPlaylistBtn.parentElement.previousElementSibling.classList.remove('d-none');
        document.querySelector('ol').innerHTML = '';
        getFromStorage();
    }
});