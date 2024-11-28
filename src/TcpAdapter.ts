import { Socket } from "net";
import { DataResolver } from "./DataResolver";
import EventEmitter from "events";
import { Transformer } from "./Transformer";
import { Packet } from "./Packet";
import { PacketProcess } from "./PacketProcess";
import { PacketTransformer } from "./PacketTransformer";

export interface TcpAdapterContext {
  dataResolver: DataResolver;
  packetTransformer: Transformer<Packet>;
  packetProcess: PacketProcess;
}

export interface TcpAdapterEventMap {
  error: [unknown, Packet?];
  disconnect: [boolean];
  packet: [Packet];
  data: [Buffer];
  packet_in_resolving: [Packet];
  packet_out_resolving: [Packet | null, Error | null];
}

export class TcpAdapter extends EventEmitter<TcpAdapterEventMap> {
  private dataResolver: DataResolver;
  private packetTransformer: Transformer<Packet>;
  private packetProcess: PacketProcess;
  constructor(
    private socket: Socket,
    context: Partial<TcpAdapterContext> = {}
  ) {
    super();
    this.dataResolver = context.dataResolver || new DataResolver();
    this.packetTransformer =
      context.packetTransformer || new PacketTransformer();
    this.packetProcess = context.packetProcess || new PacketProcess(this);
    this.init();
  }

  private handleSocketError(error: Error) {
    this.emit("error", error);
  }

  private handleSocketDisconnect(hadError: boolean) {
    this.dataResolver.clearQuietly();
    this.emit("disconnect", hadError);
  }

  private handleSocketData(data: Buffer) {
    this.emit("data", data);
    let packets: Packet[] = [];
    try {
      packets = this.packetTransformer.decode(data);
    } catch (error) {
      this.emit("error", new TypeError("INVALID_PACKET"), new Packet(data));
    }
    this.packetProcess.process(packets);
  }

  canWrite() {
    return !this.socket.destroyed;
  }

  getSocket() {
    return this.socket;
  }

  getDataResolver() {
    return this.dataResolver;
  }

  getPacketTransformer() {
    return this.packetTransformer;
  }

  setSocket(socket: Socket) {
    this.clean();
    this.socket = socket;
    this.init();
  }

  clean() {
    this.dataResolver.clearQuietly();
    this.socket.removeAllListeners();
    this.socket.destroy();
    return this;
  }

  private init() {
    this.socket.on("error", this.handleSocketError.bind(this));

    this.socket.on("close", this.handleSocketDisconnect.bind(this));

    this.socket.on("data", this.handleSocketData.bind(this));
  }
}
