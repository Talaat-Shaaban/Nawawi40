// const pexelsAccessKey = 'xZ0xa8UaeY3w6wcwEepdoDcbQh98NLt4MYp1wUcovutsjWsmjuJ4Axzz'; // مفتاح API الخاص بك

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'getRandomBackground') {
//         const query = 'nature landscapes mountains fields trees flowers';
//         const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;

//         fetch(url, {
//             headers: {
//                 Authorization: `Bearer ${pexelsAccessKey}`
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data && data.photos && data.photos.length > 0) {
//                 sendResponse({ imageUrl: data.photos[0].src.full });
//             } else {
//                 sendResponse({ error: 'No images found.' });
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching image:', error);
//             sendResponse({ error: 'Error fetching image.' });
//         });

//         return true; // لإعلام Chrome أننا نستخدم sendResponse بشكل غير متزامن
//     }
// });
