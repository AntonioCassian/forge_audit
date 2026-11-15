export type MachineStatus =
    | "OPERATIONAL"
    | "MAINTENANCE"
    | "STOPPED_DUE_TO_FAILURE";

export interface MachineProps {
    id?: string;
    name: string;
    assetCode: string;
    status: MachineStatus;
}

export class Machine {
    public readonly id?: string | undefined;
    public name: string;
    public assetCode: string;
    public status: MachineStatus;

    constructor(props: MachineProps) {
        this.id = props.id;
        this.name = props.name;
        this.assetCode = props.assetCode;
        this.status = props.status;
    }
}