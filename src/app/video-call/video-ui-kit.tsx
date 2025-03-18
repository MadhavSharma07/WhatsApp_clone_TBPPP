import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function randomID(len: number) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const appID = 363767050;
const serverSecret = "004edb14153c3c7bc1d9319adf7d661b";

export default function VideoUIKit() {
  const roomID = getUrlParams().get("roomID") || randomID(5);

  let zp: ZegoUIKitPrebuilt | null = null; // Initialize zp as null
  let myMeeting = (element: HTMLDivElement) => {
    // generate Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      randomID(5)
    );

    zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };

  const leaveRoom = () => {
    if (zp) {
      zp.destroy();
      zp = null; // Set zp to null after leaving the room
    }
  };

  return (
    <div>
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100vw", height: "100vh" }}
      ></div>
      <button onClick={leaveRoom}>Leave Room</button>
    </div>
  );
}