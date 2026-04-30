export interface ZegoUser {
  userID: string;
  userName: string;
}

export type ZegoVideoConferenceMode = string;

export interface ZegoRoomConfig {
  container: HTMLElement;
  scenario: {
    mode: ZegoVideoConferenceMode;
  };
  onJoinRoom?: () => void;
  onUserJoin?: (users: ZegoUser[]) => void;
  onUserLeave?: (users: ZegoUser[]) => void;
  onLeaveRoom?: () => void;
  showPreJoinView?: boolean;
  turnOnMicrophoneWhenJoining?: boolean;
  turnOnCameraWhenJoining?: boolean;
  showMyCameraToggleButton?: boolean;
  showMyMicrophoneToggleButton?: boolean;
  showAudioVideoSettingsButton?: boolean;
  showScreenSharingButton?: boolean;
  showTextChat?: boolean;
  showUserList?: boolean;
  maxUsers?: number;
  layout?: string;
  showLayoutButton?: boolean;
}

export interface ZegoUIKitPrebuiltInstance {
  joinRoom(config: ZegoRoomConfig): void;
  destroy(): void;
}

export interface ZegoUIKitPrebuilt {
  generateKitTokenForProduction(
    appId: number,
    token: string,
    roomID: string,
    userID: string,
    userName: string
  ): string;
  create(kitToken: string): ZegoUIKitPrebuiltInstance;
  VideoConference: ZegoVideoConferenceMode;
}

declare global {
  interface Window {
    ZegoUIKitPrebuilt?: ZegoUIKitPrebuilt;
  }
}
