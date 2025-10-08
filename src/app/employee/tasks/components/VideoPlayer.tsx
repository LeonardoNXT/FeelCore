import React from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  return (
    <div className="w-full mt-4 rounded-3xl object-cover overflow-hidden shadow-lg border-1 border-[#181818c4]">
      <Plyr
        source={{
          type: "video",
          title: title || "Vídeo",
          sources: [
            {
              src,
              type: "video/mp4",
            },
          ],
        }}
        options={{
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
        }}
      />
    </div>
  );
};

export default VideoPlayer;
