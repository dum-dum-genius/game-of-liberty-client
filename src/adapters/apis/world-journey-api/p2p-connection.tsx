export class P2pConnection {
  constructor(
    private p2pConn: RTCPeerConnection,
    private iceCandidates: RTCIceCandidate[],
    private dataChannel: RTCDataChannel | null,
    private isDataChannelReady: boolean,
    private onMessage: (msg: string) => void
  ) {}

  static create(options: { onMessage: (msg: string) => void }) {
    return new P2pConnection(new RTCPeerConnection(), [], null, false, options.onMessage);
  }

  public async createOffer(): Promise<[RTCSessionDescription | null, RTCIceCandidate[]]> {
    await new Promise((resolve) => {
      const dataChannel = this.p2pConn.createDataChannel('dataChannel');
      dataChannel.onmessage = (evt: MessageEvent<string>) => {
        this.onMessage(evt.data);
      };
      dataChannel.onopen = () => {
        this.dataChannel?.send('Offer!');
        this.isDataChannelReady = true;
      };
      dataChannel.onclose = () => {
        this.isDataChannelReady = false;
      };
      this.dataChannel = dataChannel;

      this.p2pConn.onicecandidate = (e) => {
        if (!e.candidate) {
          resolve(true);
        } else {
          this.iceCandidates.push(e.candidate);
        }
      };
      this.p2pConn.createOffer().then((offer) => {
        return this.p2pConn.setLocalDescription(offer);
      });
    });

    return [this.p2pConn.localDescription, this.iceCandidates];
  }

  public async acceptAnswer(answer: RTCSessionDescription, remoteIceCandidates: RTCIceCandidate[]) {
    this.p2pConn.setRemoteDescription(answer);
    remoteIceCandidates.forEach((remoteIceCandidate) => {
      this.p2pConn.addIceCandidate(remoteIceCandidate);
    });
  }

  public async createAnswer(
    offer: RTCSessionDescription,
    remoteIceCandidates: RTCIceCandidate[]
  ): Promise<[RTCSessionDescription | null, RTCIceCandidate[]]> {
    this.p2pConn.setRemoteDescription(offer);
    this.p2pConn.ondatachannel = (evt: RTCDataChannelEvent) => {
      this.dataChannel = evt.channel;
      this.dataChannel.onmessage = (msgEvt: MessageEvent<string>) => {
        this.onMessage(msgEvt.data);
      };
      this.dataChannel.onopen = () => {
        this.dataChannel?.send('ANSWER!');
        this.isDataChannelReady = true;
      };
      this.dataChannel.onclose = () => {
        this.isDataChannelReady = false;
      };
    };

    remoteIceCandidates.forEach((remoteIceCandidate) => {
      this.p2pConn.addIceCandidate(remoteIceCandidate);
    });

    await new Promise((resolve) => {
      this.p2pConn.onicecandidate = (e) => {
        if (!e.candidate) {
          resolve(true);
        } else {
          this.iceCandidates.push(e.candidate);
        }
      };
      this.p2pConn.createAnswer().then((answer) => {
        return this.p2pConn.setLocalDescription(answer);
      });
    });

    return [this.p2pConn.localDescription, this.iceCandidates];
  }

  public getLocalDescription(): RTCSessionDescription | null {
    return this.p2pConn.localDescription;
  }

  public getIceCandidates(): RTCIceCandidate[] {
    return this.iceCandidates;
  }

  public getIsDataChannelReady(): boolean {
    return this.isDataChannelReady;
  }

  public sendMessage(msg: string): void {
    if (!this.dataChannel) return;

    this.dataChannel.send(msg);
  }
}