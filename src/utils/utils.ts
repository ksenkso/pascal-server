// eslint-disable-next-line @typescript-eslint/ban-types
export const is = <Prototype extends Function>(target: any, prototype: Prototype): target is Prototype['prototype'] => {
  return target && target instanceof (prototype as any);
};
