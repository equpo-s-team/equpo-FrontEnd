import type { ComponentType } from 'react';

type VideoCallPageProps = {
  roomID?: string;
  userName?: string;
  sharedUrl?: string;
  onLeave?: () => void;
};

declare const VideoCallPage: ComponentType<VideoCallPageProps>;

export default VideoCallPage;

