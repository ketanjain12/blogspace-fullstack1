
// import { useEffect } from 'react';
// import React from 'react';
// const AD_UNIT_PATH = '/6355419/Travel/Europe';

// export default function GoogleTestAd({ placement }) {
//     useEffect(() => {
//         let slot = null;
//         let cancelled = false;

//         window.googletag = window.googletag || {
//             cmd: []
//         };

//         window.googletag.cmd.push(() => {
//             if (cancelled) return;

//             const g = window.googletag;
//             const divId = `blogspace-${placement}`;

//             const mapping = g.sizeMapping()
//                 .addSize(
//                     [1000, 0],
//                     [[970, 250], [728, 90], [300, 250]]
//                 )
//                 .addSize(
//                     [650, 0],
//                     [[728, 90], [336, 280], [300, 250]]
//                 )
//                 .addSize(
//                     [0, 0],
//                     [[336, 280], [300, 250]]
//                 )
//                 .build();

//             slot = g.defineSlot(
//                 AD_UNIT_PATH,
//                 [[970, 250], [728, 90], [336, 280], [300, 250]],
//                 divId
//             )
//                 .defineSizeMapping(mapping)
//                 .addService(g.pubads());

//             if (!window.__blogspaceGPTEnabled) {
//                 g.pubads().enableSingleRequest();
//                 g.enableServices();

//                 window.__blogspaceGPTEnabled = true;
//             }

//             g.display(divId);
//         });

//         return () => {
//             cancelled = true;

//             if (slot && window.googletag?.apiReady) {
//                 window.googletag.destroySlots([slot]);
//             }
//         };
//     }, [placement]);

//     return (
//         <div className="google-test-ad">
//             <div className="google-test-ad-label">
//                 Advertisement · Google Test Ad
//             </div>

//             <div
//                 id={`blogspace-${placement}`}
//                 className="google-test-ad-slot"
//             />
//         </div>
//     );
// }


import { useEffect } from 'react';
import React from 'react';
const AD_UNIT_PATH = '/6355419/Travel/Europe';

function GoogleTestAd({ placement }) {
  useEffect(() => {
    let slot = null;
    let isCancelled = false;

    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      if (isCancelled) return;

      const googletag = window.googletag;
      const elementId = `blogspace-${placement}`;

      const sizeMapping = googletag
        .sizeMapping()
        .addSize(
          [1000, 0],
          [
            [970, 250],
            [728, 90],
            [300, 250],
          ]
        )
        .addSize(
          [650, 0],
          [
            [728, 90],
            [336, 280],
            [300, 250],
          ]
        )
        .addSize(
          [0, 0],
          [
            [336, 280],
            [300, 250],
          ]
        )
        .build();

      slot = googletag
        .defineSlot(
          AD_UNIT_PATH,
          [
            [970, 250],
            [728, 90],
            [336, 280],
            [300, 250],
          ],
          elementId
        )
        .defineSizeMapping(sizeMapping)
        .addService(googletag.pubads());

      // Enable GPT services only once.
      if (!window.__blogspaceGPTEnabled) {
        googletag.enableServices();
        window.__blogspaceGPTEnabled = true;
      }

      googletag.display(elementId);
    });

    return () => {
      isCancelled = true;

      if (slot && window.googletag?.apiReady) {
        window.googletag.destroySlots([slot]);
      }
    };
  }, [placement]);

  return (
    <div className="google-test-ad">
      <div className="google-test-ad-label">
        Advertisement · Google Test Ad
      </div>

      <div
        id={`blogspace-${placement}`}
        className="google-test-ad-slot"
      />
    </div>
  );
}

export default GoogleTestAd;
