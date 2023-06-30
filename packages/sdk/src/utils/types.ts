// ENCODED ACTIONS

export type MethodParameters = {
  /**
   * The hex encoded calldata to perform the given operation
   */
  calldata: string;
  /**
   * The amount of ether (wei) to send in hex.
   */
  value: string;
};

export type SingleAction = {
  command: string;
  input: string;
};

export class MultiAction {
  public commands: string;
  public inputs: string[];

  constructor() {
    this.commands = '0x';
    this.inputs = [];
  }

  public newAction(singleAction: SingleAction): void {
    this.commands = this.commands.concat(singleAction.command);
    this.inputs.push(singleAction.input);
  }
}
