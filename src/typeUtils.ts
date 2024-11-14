export type Serializable<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;

export type PacketErrorData<T = any> = {
  message: string;
  data: T;
};
